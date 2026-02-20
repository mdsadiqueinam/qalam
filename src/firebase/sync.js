/**
 * IndexedDB → Firestore sync logic.
 *
 * Dynamically handles every table defined in `db/config.js` without
 * requiring manual updates when new tables are added.
 *
 * When a user signs in for the first time (or after using the app as a guest)
 * any locally stored records are uploaded to the user's Firestore sub-collections.
 * Subsequent writes are forwarded via the background transaction-queue consumer.
 *
 * Guard against duplication: we compare local record IDs with the ones already
 * present in Firestore and only upload records that are missing there.
 */
import CONFIG from "@root/db/config";
import { db } from "@root/db/index";
import { fetchRecords, upsertRecord, deleteRecord } from "./db";

/** Names of all tables defined in `db/config.js`. */
const ALL_TABLES = Object.keys(CONFIG);

/**
 * Sync all local IndexedDB tables to the authenticated user's Firestore
 * sub-collections.  Iterates every table from `db/config.js` dynamically.
 *
 * Algorithm per table:
 *  1. Fetch all local records (excluding soft-deleted ones when `stateId` exists).
 *  2. Fetch record IDs already in Firestore for this user + table.
 *  3. Upload only records whose IDs are not yet present in Firestore (no overwrites).
 *
 * @param {string} userId - UID of the currently signed-in Firebase user.
 * @returns {Promise<number>} Total number of records that were synced across all tables.
 */
export async function syncLocalDataToFirestore(userId) {
  let totalSynced = 0;

  for (const tableName of ALL_TABLES) {
    try {
      // 1. Read local records; skip soft-deleted entries when stateId is defined
      const tableDef = CONFIG[tableName];
      const hasStateId = "stateId" in (tableDef.fields ?? {});

      const localRecords = hasStateId
        ? await db[tableName].where("stateId").notEqual("DELETED").toArray()
        : await db[tableName].toArray();

      if (localRecords.length === 0) continue;

      // 2. Read records already in Firestore for this user + table
      const remoteRecords = await fetchRecords(userId, tableName);
      const remoteIds = new Set(remoteRecords.map((r) => r.id));

      // 3. Upload records that are not yet in Firestore
      const toSync = localRecords.filter((r) => !remoteIds.has(r.id));
      await Promise.all(toSync.map((r) => upsertRecord(userId, tableName, r)));

      totalSynced += toSync.length;
    } catch (error) {
      console.error(`[sync] Failed to sync table "${tableName}"`, error);
    }
  }

  return totalSynced;
}

/**
 * Consume the local transaction queue and replay each pending transaction
 * against Firestore for any table in `db/config.js`.
 *
 * Processed entries are removed from the queue.  If a transaction fails it is
 * left in the queue for the next attempt.
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function flushTransactionQueueToFirestore(userId) {
  const queue = await db.transactionQueue.toArray();
  if (queue.length === 0) return;

  for (const tx of queue) {
    try {
      if (!ALL_TABLES.includes(tx.table)) {
        // Table is not in CONFIG — remove stale entry and skip.
        await db.transactionQueue.delete(tx.id);
        continue;
      }

      if (tx.action === "create" || tx.action === "update") {
        // Fetch the latest local record to ensure we push the current state.
        const record = await db[tx.table].get(tx.objectId);
        if (record) {
          await upsertRecord(userId, tx.table, record);
        }
      } else if (tx.action === "delete") {
        await deleteRecord(userId, tx.table, tx.objectId);
      }

      await db.transactionQueue.delete(tx.id);
    } catch (error) {
      // Leave in queue; will be retried on next flush.
      console.error(`[sync] Failed to flush transaction ${tx.id}`, error);
    }
  }
}

/**
 * Start a background transaction-queue consumer for the given user.
 *
 * The consumer polls the local `transactionQueue` table on a short interval
 * and forwards each pending entry to Firestore.  This is the same pattern
 * described in the issue — using `setTimeout` so the queue drains
 * incrementally without blocking the UI.
 *
 * @param {string} userId
 * @returns {function(): void} Call to stop the consumer.
 */
export function startTransactionQueueConsumer(userId) {
  let stopped = false;

  async function processNext() {
    if (stopped) return;
    try {
      await flushTransactionQueueToFirestore(userId);
    } catch (error) {
      console.error("[sync] Error in transaction queue consumer", error);
    }
    // Schedule the next poll regardless of success/failure
    setTimeout(processNext, 2000);
  }

  // Kick off the first iteration
  setTimeout(processNext, 0);

  return function stop() {
    stopped = true;
  };
}
