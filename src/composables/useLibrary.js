import { computed } from "vue";
import { useDexieLiveQuery } from "@utils/useDexieLiveQuery";
import { db } from "@root/db/index";

export function useLibrary() {
  // --- Vars
  const activeTab = useLocalStorage("qalam-library-active-tab", "all");
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
