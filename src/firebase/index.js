/**
 * Firebase initialisation.
 *
 * All Firebase configuration values are read from Vite's `import.meta.env`
 * so they can be supplied via a `.env.local` file (never committed) without
 * hard-coding secrets.  See `.env.example` at the project root for the full
 * list of required variables.
 *
 * When no Firebase environment variables are present the module exports
 * `null` for all three singletons so the rest of the application can detect
 * this and fall back to local IndexedDB-only mode for guest users.
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Object.values(firebaseConfig).every(Boolean);

if (!isConfigured) {
  console.warn(
    "[firebase] One or more VITE_FIREBASE_* environment variables are missing. " +
      "Firebase authentication and sync will be unavailable. " +
      "See .env.example for the required variables.",
  );
}

export const firebaseApp = isConfigured ? initializeApp(firebaseConfig) : null;
export const firebaseAuth = isConfigured ? getAuth(firebaseApp) : null;
export const firestore = isConfigured ? getFirestore(firebaseApp) : null;

/** Whether Firebase is fully configured and available. */
export const isFirebaseConfigured = isConfigured;
