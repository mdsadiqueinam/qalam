import { computed, ref, watch, onUnmounted } from "vue";
import { useDexieLiveQuery } from "@utils/useDexieLiveQuery";
import { db } from "@root/db/index";
import { currentUser } from "@root/firebase/auth";
import { subscribeToBooks } from "@root/firebase/db";

export function useLibrary() {
  // --- Vars
  const activeTab = useLocalStorage("qalam-library-active-tab", "all");

  // Books from local IndexedDB (always live)
  const localBooks = useDexieLiveQuery(() => db.books.toArray(), {
    initialValue: [],
  });

  // Books from Firestore (only populated when authenticated)
  const firebaseBooks = ref([]);
  let unsubscribeFirestore = null;

  /** Clean up any existing Firestore subscription. */
  function cleanupFirestoreSubscription() {
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
      unsubscribeFirestore = null;
    }
  }

  /**
   * Subscribe to Firestore real-time updates when the user is signed in.
   * Unsubscribe and clear when signed out.
   */
  watch(
    currentUser,
    (user) => {
      cleanupFirestoreSubscription();

      if (user) {
        // Authenticated: subscribe to the user's Firestore books collection
        unsubscribeFirestore = subscribeToBooks(user.uid, (books) => {
          firebaseBooks.value = books;
        });
      } else {
        // Unauthenticated: fall back to IndexedDB
        firebaseBooks.value = [];
      }
    },
    { immediate: true },
  );

  // Unsubscribe from Firestore when the component that owns this composable is destroyed
  onUnmounted(cleanupFirestoreSubscription);

  /**
   * The active books list:
   *  - Authenticated → Firestore books (real-time)
   *  - Guest → local IndexedDB books (live query)
   */
  const books = computed(() =>
    currentUser.value ? firebaseBooks.value : localBooks.value,
  );

  // --- Computed
  const filteredBooks = computed(() => {
    if (activeTab.value === "all") return books.value;
    return books.value.filter((book) => book.status === activeTab.value);
  });

  return {
    activeTab,
    books,
    filteredBooks,
  };
}
