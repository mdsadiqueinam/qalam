import { computed } from "vue";
import { useDexieLiveQuery } from "@utils/useDexieLiveQuery";
import { db } from "@root/db/index";

/**
 * Library composable.
 *
 * IndexedDB is always the source of truth for the book list.
 *
 * For authenticated users, the Firebase sync layer (see `firebase/sync.js`)
 * keeps IndexedDB up to date with Firestore in real time — both the user's
 * own private books and public books from other users are written into the
 * local database so the UI reads them seamlessly here.
 *
 * For guest users, only locally created books appear.
 */
export function useLibrary() {
  // --- Vars
  const activeTab = useLocalStorage("qalam-library-active-tab", "all");

  // All books from IndexedDB (live — reacts to inserts, updates, deletes
  // whether they come from local operations or the Firestore sync layer).
  const books = useDexieLiveQuery(() => db.books.toArray(), {
    initialValue: [],
  });

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
