import { computed, ref, watch, onUnmounted } from "vue";
import { useDexieLiveQuery } from "@utils/useDexieLiveQuery";
import { db } from "@root/db/index";
import { currentUser } from "@root/firebase/auth";
import { subscribeToTable, subscribeToPublicTable } from "@root/firebase/db";

export function useLibrary() {
  // --- Vars
  const activeTab = useLocalStorage("qalam-library-active-tab", "all");

  // Books from local IndexedDB (always live; used when not authenticated)
  const localBooks = useDexieLiveQuery(() => db.books.toArray(), {
    initialValue: [],
  });

  // Books from the user's private Firestore collection (authenticated only)
  const privateBooks = ref([]);
  // Books from the shared public Firestore collection (authenticated only)
  const publicBooks = ref([]);

  let unsubscribePrivate = null;
  let unsubscribePublic = null;

  /** Stop all active Firestore subscriptions. */
  function cleanupFirestoreSubscriptions() {
    if (unsubscribePrivate) {
      unsubscribePrivate();
      unsubscribePrivate = null;
    }
    if (unsubscribePublic) {
      unsubscribePublic();
      unsubscribePublic = null;
    }
  }

  /**
   * Subscribe to Firestore real-time updates when the user is signed in.
   * - Private collection  →  books owned by this user
   * - Public collection   →  books marked isPublic by any user
   * Unsubscribes and clears when the user signs out.
   */
  watch(
    currentUser,
    (user) => {
      cleanupFirestoreSubscriptions();

      if (user) {
        // Private books for the authenticated user
        unsubscribePrivate = subscribeToTable(user.uid, "books", (books) => {
          privateBooks.value = books;
        });

        // Public books from all users (excludes duplicates via merge below)
        unsubscribePublic = subscribeToPublicTable("books", (books) => {
          publicBooks.value = books;
        });
      } else {
        privateBooks.value = [];
        publicBooks.value = [];
      }
    },
    { immediate: true },
  );

  // Clean up Firestore listeners when the owning component is destroyed
  onUnmounted(cleanupFirestoreSubscriptions);

  /**
   * The merged books list for authenticated users.
   *
   * Own books take precedence (they may have `isPublic: false` locally
   * while a stale public copy still exists).  Public books from other
   * users are appended, deduplicating by `id`.
   */
  const firebaseBooks = computed(() => {
    const ownIds = new Set(privateBooks.value.map((b) => b.id));
    // Add public books from OTHER users (not already in own collection)
    const othersPublic = publicBooks.value.filter((b) => !ownIds.has(b.id));
    return [...privateBooks.value, ...othersPublic];
  });

  /**
   * The active books list:
   *  - Authenticated → merged private + public Firestore books (real-time)
   *  - Guest         → local IndexedDB books (live query)
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
