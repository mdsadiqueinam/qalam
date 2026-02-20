/**
 * Firebase Authentication composable.
 *
 * Exposes a reactive `currentUser` ref that is kept in sync with the Firebase
 * Auth state.  Provides `signInWithGoogle` and `signOut` helpers.
 *
 * When Firebase is not configured (missing env vars) these helpers are no-ops
 * and `currentUser` stays `null` so the app continues in guest-only mode.
 */
import { ref, readonly } from "vue";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "./index";

/** @type {import('vue').Ref<import('firebase/auth').User | null>} */
const _currentUser = ref(null);

/**
 * Read-only reactive reference to the currently authenticated Firebase user.
 * `null` when the user is not signed in.
 */
export const currentUser = readonly(_currentUser);

// Keep `currentUser` in sync with Firebase Auth state changes.
if (isFirebaseConfigured) {
  onAuthStateChanged(firebaseAuth, (user) => {
    _currentUser.value = user;
  });
}

/**
 * Trigger a Google OAuth pop-up sign-in flow.
 * Throws if Firebase is not configured.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    throw new Error("[firebase] Firebase is not configured. Set VITE_FIREBASE_* env variables.");
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(firebaseAuth, provider);
}

/**
 * Sign the current user out of Firebase Auth.
 * @returns {Promise<void>}
 */
export async function signOut() {
  if (!isFirebaseConfigured) return;
  return firebaseSignOut(firebaseAuth);
}
