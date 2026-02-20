/**
 * Generic Firestore helpers for any table defined in `db/config.js`.
 *
 * Storage layout:
 *
 *  Private records  →  `users/{userId}/{tableName}/{docId}`
 *    Readable only by the owning user.
 *
 *  Public records   →  `public/{tableName}/{docId}`
 *    When a record's `isPublic` field is `true`, a copy is also written here
 *    so that all authenticated users can read it.
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

// ---------------------------------------------------------------------------
// Internal ref helpers
// ---------------------------------------------------------------------------

/**
 * Private collection reference — `users/{userId}/{tableName}`.
 * @param {string} userId
 * @param {string} tableName
 */
function privateTableRef(userId, tableName) {
  return collection(firestore, "users", userId, tableName);
}

/**
 * Private document reference — `users/{userId}/{tableName}/{docId}`.
 * @param {string} userId
 * @param {string} tableName
 * @param {string} docId
 */
function privateRecordRef(userId, tableName, docId) {
  return doc(firestore, "users", userId, tableName, docId);
}

/**
 * Public collection reference — `public/{tableName}`.
 * @param {string} tableName
 */
function publicTableRef(tableName) {
  return collection(firestore, "public", tableName);
}

/**
 * Public document reference — `public/{tableName}/{docId}`.
 * @param {string} tableName
 * @param {string} docId
 */
function publicRecordRef(tableName, docId) {
  return doc(firestore, "public", tableName, docId);
}

// ---------------------------------------------------------------------------
// Private collection helpers
// ---------------------------------------------------------------------------

/**
 * Fetch all records from a user's private table.
 * @param {string} userId
 * @param {string} tableName
 * @returns {Promise<Object[]>}
 */
export async function fetchRecords(userId, tableName) {
  const snapshot = await getDocs(privateTableRef(userId, tableName));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Write (create or overwrite) a record in the user's private collection.
 * If the record has `isPublic: true` a copy is also written to the public
 * collection so all authenticated users can read it.
 * If `isPublic` is falsy the public copy (if any) is removed.
 *
 * @param {string} userId
 * @param {string} tableName
 * @param {Object} record - Plain record object (must contain `id`).
 * @returns {Promise<void>}
 */
export async function upsertRecord(userId, tableName, record) {
  const { id, ...data } = record;
  const payload = { ...data, updatedAt: serverTimestamp() };

  // Always write to the private collection
  await setDoc(privateRecordRef(userId, tableName, id), payload);

  // Mirror to / remove from the public collection based on the isPublic flag
  if (record.isPublic) {
    await setDoc(publicRecordRef(tableName, id), { ...payload, userId });
  } else {
    // Best-effort removal; ignore errors if the doc does not exist
    await deleteDoc(publicRecordRef(tableName, id)).catch(() => {});
  }
}

/**
 * Hard-delete a record from both the private and public collections.
 * @param {string} userId
 * @param {string} tableName
 * @param {string} docId
 * @returns {Promise<void>}
 */
export async function deleteRecord(userId, tableName, docId) {
  await Promise.all([
    deleteDoc(privateRecordRef(userId, tableName, docId)),
    deleteDoc(publicRecordRef(tableName, docId)).catch(() => {}),
  ]);
}

/**
 * Subscribe to real-time updates for a user's private table.
 *
 * @param {string} userId
 * @param {string} tableName
 * @param {function(Object[]): void} callback
 * @returns {function(): void} Unsubscribe function.
 */
export function subscribeToTable(userId, tableName, callback) {
  return onSnapshot(privateTableRef(userId, tableName), (snapshot) => {
    const records = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(records);
  });
}

// ---------------------------------------------------------------------------
// Public collection helpers
// ---------------------------------------------------------------------------

/**
 * Fetch all records from the shared public table.
 * @param {string} tableName
 * @returns {Promise<Object[]>}
 */
export async function fetchPublicRecords(tableName) {
  const snapshot = await getDocs(publicTableRef(tableName));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Subscribe to real-time updates for the shared public table.
 * Use this to show public records from all users.
 *
 * @param {string} tableName
 * @param {function(Object[]): void} callback
 * @returns {function(): void} Unsubscribe function.
 */
export function subscribeToPublicTable(tableName, callback) {
  return onSnapshot(publicTableRef(tableName), (snapshot) => {
    const records = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(records);
  });
}
