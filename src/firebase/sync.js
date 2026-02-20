/**
 * IndexedDB → Firestore sync logic.
 *
 * When a user signs in for the first time (or after using the app as a guest)
 * any books stored locally in Dexie are uploaded to the user's Firestore
 * document tree.  Subsequent writes go straight to Firestore via the
 * transaction queue consumer.
 *
 * Guard against duplication: we compare local book IDs with the ones already
 * present in Firestore and only upload books that are missing there.
 */
import { db } from "@root/db/index";
import { fetchBooks, upsertBook, deleteBook } from "./db";

/**
 * Sync local IndexedDB books to the authenticated user's Firestore collection.
 *
 * Algorithm:
 *  1. Fetch all books stored in local IndexedDB.
 *  2. Fetch book IDs already in Firestore for this user.
 *  3. Upload only books whose IDs are not yet present in Firestore (no overwrites).
 *
 * @param {string} userId - UID of the currently signed-in Firebase user.
 * @returns {Promise<number>} Number of books that were synced.
 */
export async function syncLocalBooksToFirestore(userId) {
  // 1. Read local books (only ACTIVE ones to avoid syncing deleted entries)
  const localBooks = await db.books
    .where("stateId")
    .notEqual("DELETED")
    .toArray();

  if (localBooks.length === 0) return 0;

  // 2. Read books already in Firestore for this user
  const remoteBooks = await fetchBooks(userId);
  const remoteIds = new Set(remoteBooks.map((b) => b.id));

  // 3. Upload books that are not yet in Firestore
  const toSync = localBooks.filter((book) => !remoteIds.has(book.id));

  await Promise.all(toSync.map((book) => upsertBook(userId, book)));

  return toSync.length;
}

/**
 * Consume the local transaction queue and replay each pending transaction
 * against Firestore.  This handles operations that were queued offline while
 * the user was not signed in.
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
      if (tx.table !== "books") {
        // Only books are synced via Firestore in this implementation.
        await db.transactionQueue.delete(tx.id);
        continue;
      }

      if (tx.action === "create" || tx.action === "update") {
        // Fetch the latest local record to ensure we push the current state.
        const book = await db.books.get(tx.objectId);
        if (book) {
          await upsertBook(userId, book);
        }
      } else if (tx.action === "delete") {
        await deleteBook(userId, tx.objectId);
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
 * @returns {function(): void}  Call to stop the consumer.
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
