/**
 * `useAuth` composable — reactive Firebase Auth state with sync-on-login.
 *
 * Usage (auto-imported via unplugin-auto-import):
 *   const { currentUser, isAuthenticated, signIn, signOut } = useAuth();
 *
 * On successful sign-in:
 *   1. All local IndexedDB data (every table from `db/config.js`) is synced to Firestore.
 *   2. A background transaction-queue consumer is started so subsequent
 *      IndexedDB writes are automatically forwarded to Firestore.
 */
import { computed, ref } from "vue";
import { currentUser, signInWithGoogle, signOut as firebaseSignOut } from "@root/firebase/auth";
import {
  syncLocalDataToFirestore,
  startTransactionQueueConsumer,
} from "@root/firebase/sync";

/** `true` while a sign-in / sync operation is in progress. */
const isSyncing = ref(false);

/** Human-readable status message shown during sync. */
const syncStatus = ref("");

/** Whether the user is currently authenticated. */
const isAuthenticated = computed(() => currentUser.value !== null);

/** Stop function returned by `startTransactionQueueConsumer`. */
let stopConsumer = null;

/**
 * Initiate Google sign-in, then sync any local IndexedDB data to Firestore
 * and start the background transaction-queue consumer.
 * @returns {Promise<void>}
 */
async function signIn() {
  isSyncing.value = true;
  syncStatus.value = "Signing in…";
  try {
    await signInWithGoogle();
    const userId = currentUser.value?.uid;
    if (userId) {
      syncStatus.value = "Syncing local data…";
      // Upload any offline data (all tables) written before the user authenticated.
      // Even if the initial sync fails, we start the consumer so future
      // transactions are forwarded and the sync can be retried.
      try {
        await syncLocalDataToFirestore(userId);
      } catch (error) {
        console.error("[useAuth] Initial sync failed", error);
      }
      // Start background consumer to forward future IndexedDB transactions to Firestore
      stopConsumer = startTransactionQueueConsumer(userId);
    }
  } finally {
    isSyncing.value = false;
    syncStatus.value = "";
  }
}

/**
 * Sign the current user out of Firebase Auth and stop the queue consumer.
 * @returns {Promise<void>}
 */
async function signOut() {
  // Stop the transaction-queue consumer before signing out
  if (stopConsumer) {
    stopConsumer();
    stopConsumer = null;
  }
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
