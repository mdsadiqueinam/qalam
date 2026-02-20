/**
 * Generic Firestore helpers for any table defined in `db/config.js`.
 *
 * All user data lives under `users/{userId}/{tableName}/{docId}` so that
 * every authenticated user has their own isolated sub-collection per table.
 *
 * The helpers are table-agnostic: pass the `tableName` string that matches
 * the key used in `db/config.js` (e.g. `"books"`).
 */
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "./index";

/**
 * Returns a Firestore collection reference for a user's table.
 * @param {string} userId
 * @param {string} tableName - Must match a key in `db/config.js`.
 */
function tableRef(userId, tableName) {
  return collection(firestore, "users", userId, tableName);
}

/**
 * Returns a Firestore document reference for a single record.
 * @param {string} userId
 * @param {string} tableName
 * @param {string} docId
 */
function recordRef(userId, tableName, docId) {
  return doc(firestore, "users", userId, tableName, docId);
}

/**
 * Fetch all records for a given table as a plain array.
 * @param {string} userId
 * @param {string} tableName
 * @returns {Promise<Object[]>}
 */
export async function fetchRecords(userId, tableName) {
  const snapshot = await getDocs(tableRef(userId, tableName));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Write (create or overwrite) a record document in Firestore.
 * `updatedAt` is always refreshed to the server timestamp.
 * @param {string} userId
 * @param {string} tableName
 * @param {Object} record - Plain record object (must contain `id`).
 * @returns {Promise<void>}
 */
export async function upsertRecord(userId, tableName, record) {
  const { id, ...data } = record;
  await setDoc(recordRef(userId, tableName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Hard-delete a record document from Firestore.
 * @param {string} userId
 * @param {string} tableName
 * @param {string} docId
 * @returns {Promise<void>}
 */
export async function deleteRecord(userId, tableName, docId) {
  await deleteDoc(recordRef(userId, tableName, docId));
}

/**
 * Subscribe to real-time updates for a user's table.
 * Calls `callback` with an array of records whenever the collection changes.
 *
 * @param {string} userId
 * @param {string} tableName
 * @param {function(Object[]): void} callback
 * @returns {function(): void} Unsubscribe function.
 */
export function subscribeToTable(userId, tableName, callback) {
  return onSnapshot(tableRef(userId, tableName), (snapshot) => {
    const records = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(records);
  });
}
