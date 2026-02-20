/**
 * `useAuth` composable — reactive Firebase Auth state with bidirectional sync.
 *
 * Usage (auto-imported via unplugin-auto-import):
 *   const { currentUser, isAuthenticated, isSyncing, syncStatus, signIn, signOut } = useAuth();
 *
 * On any authentication event (explicit sign-in OR page-load auth restoration):
 *   1. Local IndexedDB data is uploaded to the user's Firestore collection.
 *      Guest-created records (userId = null) are stamped with the user's UID.
 *   2. The user's private Firestore records AND all public records are pulled
 *      into IndexedDB so the UI always reads from the local database.
 *   3. A background transaction-queue consumer forwards subsequent IndexedDB
 *      writes to Firestore.
 *   4. Real-time Firestore listeners keep IndexedDB in sync as data changes
 *      on other devices or from other users' public records.
 *
 * On sign-out, all background sync processes are stopped.
 */
import { computed, ref } from "vue";
import { currentUser, signInWithGoogle, signOut as firebaseSignOut, onAuthChange } from "@root/firebase/auth";
import {
  syncLocalDataToFirestore,
  pullFirestoreToIndexedDB,
  startTransactionQueueConsumer,
  startFirestoreToIndexedDBSync,
} from "@root/firebase/sync";
import { dbReady } from "@root/db/index";

/** `true` while a sign-in / sync operation is in progress. */
const isSyncing = ref(false);

/** Human-readable status message shown during sync. */
const syncStatus = ref("");

/** Whether the user is currently authenticated. */
const isAuthenticated = computed(() => currentUser.value !== null);

/** Stop function returned by `startTransactionQueueConsumer`. */
let stopConsumer = null;
/** Stop function returned by `startFirestoreToIndexedDBSync`. */
let stopRealTimeSync = null;

/**
 * Start all sync processes for the given user.
 * Called both on explicit sign-in and on page-load auth restoration.
 *
 * @param {string} userId
 */
async function initSyncForUser(userId) {
  isSyncing.value = true;
  syncStatus.value = "Syncing data…";
  try {
    // Ensure IndexedDB is ready before any DB operations
    await dbReady;

    // Upload local records to Firestore (stamps userId on guest records)
    await syncLocalDataToFirestore(userId);

    // Pull Firestore records (private + public) down into IndexedDB
    await pullFirestoreToIndexedDB(userId);

    // Start background processes
    stopConsumer = startTransactionQueueConsumer(userId);
    stopRealTimeSync = await startFirestoreToIndexedDBSync(userId);
  } catch (error) {
    console.error("[useAuth] Sync initialisation failed", error);
  } finally {
    isSyncing.value = false;
    syncStatus.value = "";
  }
}

/** Stop all active sync processes. */
function stopSync() {
  if (stopConsumer) {
    stopConsumer();
    stopConsumer = null;
  }
  if (stopRealTimeSync) {
    stopRealTimeSync();
    stopRealTimeSync = null;
  }
}

// Handle auth state changes at module level so they fire on page-load
// restoration as well as on explicit sign-in / sign-out.
onAuthChange(async (user) => {
  if (user) {
    await initSyncForUser(user.uid);
  } else {
    stopSync();
  }
});

/**
 * Trigger a Google sign-in popup.
 * The `onAuthChange` listener above handles the post-sign-in sync.
 * @returns {Promise<void>}
 */
async function signIn() {
  await signInWithGoogle();
}

/**
 * Sign out and stop all sync processes.
 * @returns {Promise<void>}
 */
async function signOut() {
  stopSync();
  await firebaseSignOut();
}

export function useAuth() {
  return {
    currentUser,
    isAuthenticated,
    isSyncing,
    syncStatus,
    signIn,
    signOut,
  };
}
