/**
 * Bidirectional sync between IndexedDB (Dexie) and Firestore.
 *
 * Architecture
 * ────────────
 * IndexedDB is the SINGLE source of truth for the UI.  All reads in
 * components and composables go through `db[tableName]`.  Firestore is the
 * backend persistence / real-time collaboration layer.
 *
 * On sign-in (or page-load with a restored session):
 *
 *  1. syncLocalDataToFirestore(userId)
 *     Upload any local records that are not yet in the user's Firestore
 *     private collection.  Guest-created records (userId = null) are
 *     stamped with the authenticated user's UID at this point — both in
 *     IndexedDB and in Firestore.
 *
 *  2. pullFirestoreToIndexedDB(userId)
 *     Download the user's private records AND all public records from
 *     Firestore into local IndexedDB.  Converts Firestore Timestamps to
 *     JS Dates.  Does NOT go through logTransaction, so these writes do
 *     not re-queue to Firestore.
 *
 *  3. startTransactionQueueConsumer(userId)
 *     Background setTimeout loop: drains the transaction queue (created by
 *     db[table].create / .save / .delete / etc.) and forwards each entry to
 *     Firestore.
 *
 *  4. startFirestoreToIndexedDBSync(userId)
 *     Sets up real-time onSnapshot listeners for both the private and
 *     public Firestore collections.  Changes are written directly to
 *     IndexedDB (bypassing logTransaction) so the live query in the UI
 *     stays up to date.
 *
 * All of the above is driven dynamically from `db/config.js`, so adding a
 * new table to the config requires no changes here.
 */
import CONFIG from "@root/db/config";
import { db, dbReady } from "@root/db/index";
import {
  fetchRecords,
  fetchPublicRecords,
  upsertRecord,
  deleteRecord,
  watchTableChanges,
  watchPublicTableChanges,
} from "./db";

/** Names of all tables defined in `db/config.js`. */
const ALL_TABLES = Object.keys(CONFIG);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert any Firestore Timestamp objects inside a plain record to JS Dates.
 * @param {Object} record
 * @returns {Object}
 */
function convertTimestamps(record) {
  const out = {};
  for (const [key, value] of Object.entries(record)) {
    out[key] =
      value !== null &&
      value !== undefined &&
      typeof value.toDate === "function"
        ? value.toDate()
        : value;
  }
  return out;
}

// ---------------------------------------------------------------------------
// 1. IndexedDB → Firestore (initial upload on sign-in)
// ---------------------------------------------------------------------------

/**
 * Upload local IndexedDB records to the user's Firestore private collection.
 *
 * Only records that are NOT already present in Firestore are uploaded
 * (deduplication guard).  Records that were created as a guest
 * (`userId = null`) are stamped with the authenticated user's UID in
 * both IndexedDB and Firestore.
 *
 * Works across all tables defined in `db/config.js` dynamically.
 *
 * @param {string} userId - UID of the currently signed-in Firebase user.
 * @returns {Promise<number>} Total number of records uploaded.
 */
export async function syncLocalDataToFirestore(userId) {
  await dbReady;
  let totalSynced = 0;

  for (const tableName of ALL_TABLES) {
    try {
      const tableDef = CONFIG[tableName];
      const hasStateId = "stateId" in (tableDef.fields ?? {});
      const hasUserId = "userId" in (tableDef.fields ?? {});

      // Read local records; skip soft-deleted entries when stateId is defined
      const localRecords = hasStateId
        ? await db[tableName].where("stateId").notEqual("DELETED").toArray()
        : await db[tableName].toArray();

      if (localRecords.length === 0) continue;

      // Fetch IDs already in Firestore to avoid overwriting newer remote data
      const remoteRecords = await fetchRecords(userId, tableName);
      const remoteIds = new Set(remoteRecords.map((r) => r.id));

      // Upload only records not yet in Firestore
      const toUpload = localRecords.filter((r) => !remoteIds.has(r.id));

      for (const record of toUpload) {
        // Stamp userId on guest-created records before uploading
        if (hasUserId && record.userId == null) {
          record.userId = userId;
          // Persist the updated userId back to IndexedDB
          await db[tableName].update(record.id, { userId });
        }
        await upsertRecord(userId, tableName, record);
        totalSynced++;
      }
    } catch (error) {
      console.error(`[sync] Failed to upload table "${tableName}"`, error);
    }
  }

  return totalSynced;
}

// ---------------------------------------------------------------------------
// 2. Firestore → IndexedDB (initial download on sign-in)
// ---------------------------------------------------------------------------

/**
 * Download Firestore records (private + public) into local IndexedDB.
 *
 * For each table in `db/config.js`:
 *  - Fetches the user's own private records.
 *  - Fetches all public records from the shared collection.
 *  - Merges them (private takes precedence when IDs overlap).
 *  - Writes them into IndexedDB using `put()` — bypasses `logTransaction`
 *    so these writes are NOT re-queued back to Firestore.
 *
 * Firestore Timestamps are converted to JS Dates before writing.
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function pullFirestoreToIndexedDB(userId) {
  await dbReady;

  for (const tableName of ALL_TABLES) {
    try {
      // Fetch private (own) and public records in parallel
      const [privateRecords, publicRecords] = await Promise.all([
        fetchRecords(userId, tableName),
        fetchPublicRecords(tableName),
      ]);

      // Merge: private records take precedence over public (same ID)
      const merged = new Map();
      for (const r of publicRecords) merged.set(r.id, r);
      for (const r of privateRecords) merged.set(r.id, r); // own records win

      const records = Array.from(merged.values()).map(convertTimestamps);
      if (records.length === 0) continue;

      // Bulk write to IndexedDB, bypassing logTransaction
      await db[tableName].bulkPut(records);
    } catch (error) {
      console.error(`[sync] Failed to pull table "${tableName}"`, error);
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Transaction queue consumer (ongoing IndexedDB → Firestore)
// ---------------------------------------------------------------------------

/**
 * Drain the local `transactionQueue` table and forward each pending entry
 * to Firestore.  Entries for tables not in CONFIG are discarded.
 *
 * On create/update: fetches the latest record from IndexedDB and upserts it
 * to Firestore (so the most-recent local state is always pushed).
 * On delete:  removes the document from Firestore.
 *
 * Failed entries are left in the queue and retried on the next flush.
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
        // Unknown table — discard stale entry
        await db.transactionQueue.delete(tx.id);
        continue;
      }

      if (tx.action === "create" || tx.action === "update") {
        // Fetch the LATEST local state to ensure Firestore gets the most recent version
        const record = await db[tx.table].get(tx.objectId);
        if (record) {
          await upsertRecord(userId, tx.table, record);
        }
      } else if (tx.action === "delete") {
        await deleteRecord(userId, tx.table, tx.objectId);
      }

      await db.transactionQueue.delete(tx.id);
    } catch (error) {
      // Leave in queue; will be retried on next flush
      console.error(`[sync] Failed to flush transaction ${tx.id}`, error);
    }
  }
}

/**
 * Start a background transaction-queue consumer that forwards IndexedDB
 * writes to Firestore using a `setTimeout` loop.
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
    setTimeout(processNext, 2000);
  }

  setTimeout(processNext, 0);

  return function stop() {
    stopped = true;
  };
}

// ---------------------------------------------------------------------------
// 4. Real-time Firestore → IndexedDB sync (ongoing)
// ---------------------------------------------------------------------------

/**
 * Subscribe to real-time Firestore changes and apply them directly to
 * IndexedDB.  Covers both the private user collection and the shared
 * public collection for every table in `db/config.js`.
 *
 * Writes go through `db[tableName].put()` / `.delete()` directly,
 * bypassing `logTransaction`, so they do NOT re-queue back to Firestore.
 *
 * Firestore Timestamps are converted to JS Dates before writing.
 *
 * @param {string} userId
 * @returns {function(): void} Call to stop all listeners.
 */
export async function startFirestoreToIndexedDBSync(userId) {
  await dbReady;
  const unsubscribers = [];

  for (const tableName of ALL_TABLES) {
    // ── Private collection listener ──────────────────────────────────────
    const unsubPrivate = watchTableChanges(userId, tableName, (changes) => {
      for (const change of changes) {
        const record = convertTimestamps({ id: change.id, ...change.data });
        if (change.type === "added" || change.type === "modified") {
          db[tableName].put(record).catch((err) =>
            console.error(`[sync] Failed to put ${tableName} ${record.id}`, err),
          );
        } else if (change.type === "removed") {
          db[tableName].delete(change.id).catch((err) =>
            console.error(`[sync] Failed to delete ${tableName} ${change.id}`, err),
          );
        }
      }
    });
    unsubscribers.push(unsubPrivate);

    // ── Public collection listener ───────────────────────────────────────
    const unsubPublic = watchPublicTableChanges(tableName, (changes) => {
      for (const change of changes) {
        // Skip records that belong to the current user — the private listener
        // already handles those and is the authoritative source.
        if (change.data.userId === userId) continue;

        const record = convertTimestamps({ id: change.id, ...change.data });
        if (change.type === "added" || change.type === "modified") {
          db[tableName].put(record).catch((err) =>
            console.error(`[sync] Failed to put public ${tableName} ${record.id}`, err),
          );
        } else if (change.type === "removed") {
          db[tableName].delete(change.id).catch((err) =>
            console.error(`[sync] Failed to delete public ${tableName} ${change.id}`, err),
          );
        }
      }
    });
    unsubscribers.push(unsubPublic);
  }

  return function stop() {
    unsubscribers.forEach((unsub) => unsub());
  };
}
