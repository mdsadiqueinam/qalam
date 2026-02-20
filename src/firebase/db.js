/**
 * Firestore helpers for the `books` collection.
 *
 * When a user is authenticated all book reads / writes go through these
 * functions instead of the local Dexie (IndexedDB) database.
 *
 * Collection path: `users/{userId}/books/{bookId}`
 */
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "./index";

/**
 * Returns a Firestore collection reference for the given user's books.
 * @param {string} userId
 */
function booksRef(userId) {
  return collection(firestore, "users", userId, "books");
}

/**
 * Returns a Firestore document reference for a single book.
 * @param {string} userId
 * @param {string} bookId
 */
function bookDocRef(userId, bookId) {
  return doc(firestore, "users", userId, "books", bookId);
}

/**
 * Fetch all books for a user as a plain array.
 * @param {string} userId
 * @returns {Promise<Object[]>}
 */
export async function fetchBooks(userId) {
  const snapshot = await getDocs(booksRef(userId));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Write (create or overwrite) a book document in Firestore.
 * `createdAt` / `updatedAt` are kept as-is if already present;
 * `updatedAt` is refreshed to the server timestamp on every write.
 * @param {string} userId
 * @param {Object} book  - Plain book object (must contain `id`).
 * @returns {Promise<void>}
 */
export async function upsertBook(userId, book) {
  const { id, ...data } = book;
  await setDoc(bookDocRef(userId, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Partially update a book document in Firestore.
 * @param {string} userId
 * @param {string} bookId
 * @param {Object} changes  - Fields to update.
 * @returns {Promise<void>}
 */
export async function updateBook(userId, bookId, changes) {
  await updateDoc(bookDocRef(userId, bookId), {
    ...changes,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Hard-delete a book document from Firestore.
 * @param {string} userId
 * @param {string} bookId
 * @returns {Promise<void>}
 */
export async function deleteBook(userId, bookId) {
  await deleteDoc(bookDocRef(userId, bookId));
}

/**
 * Subscribe to real-time updates for a user's books.
 * Calls `callback` with an array of book objects whenever the collection changes.
 *
 * @param {string} userId
 * @param {function(Object[]): void} callback
 * @returns {function(): void}  Unsubscribe function.
 */
export function subscribeToBooks(userId, callback) {
  return onSnapshot(booksRef(userId), (snapshot) => {
    const books = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(books);
  });
}
