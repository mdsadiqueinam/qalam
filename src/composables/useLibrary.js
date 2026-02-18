import { ref, computed } from "vue";

export function useLibrary() {
  // --- Vars
  const activeTab = ref("all");

  const books = ref([
    {
      id: 1,
      title: "Classical Poetry Collection",
      editedAt: "Edited 2 hours ago",
      status: "recent",
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCEwxbnRw8hyv1dzgL_uGdrAzpx8x0V2-5QV8_uKexgBoapJcvX_q_o5SGUR7McSK6Xa1EWfvMv_RQ1gPnACrflBs6MX9CVGhBEE6_x8Z_1Gv2roWc1c3tiZYxUKlwROJd49Lw9kLqTHyPa6NsF2JE5n7A8O2YB5Orv7R-46Z2Kjz2h2sZED-L-iEW9p7ZgafvXdpvuW-YFp_Uc9qcQ93Jbrx5444muM94mN26y3xIEgCVx_JWjj9RTP8Z2DLCzNMrcF8wUd0SaTgc",
      coverAlt: "Elegant classical Arabic book cover design",
    },
    {
      id: 2,
      title: "Modern Short Stories",
      editedAt: "Edited yesterday",
      status: "recent",
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ6GfJH7wrsnfRvckCtNSPHDihy9s-7xQHDbGityvJRAXEy96tD10Te329EEmO81DqXWFSf33YvcWNGqFDo0kStDr45KBLexlTtm1kASDBWTP7y__zVFSShnghRHPBT1f9jDUghlRHrpr9UP_oS0w3qnlbrU7DcqXPKpql0nfjThpjn916uy5uObiceRXBce8g6DozCsS7uAq-S2i8QYkq8RduficBCRYrnP3a2IjwS9a97LD_ay-BcjuEBictgErMIzSPM0mVan0",
      coverAlt: "Modern minimalist aesthetic book cover illustration",
    },
    {
      id: 3,
      title: "Arabic Grammar Guide",
      editedAt: "Edited 3 days ago",
      status: "drafts",
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDW3vMfVDgoE3VpQSFvmDRK8o5ne6wVyaa8ObHF5g37X49eG6YdXagrxQ43FbpZPnWeldbsGqDjgrxCK0_njj0Gk-19u50d1D31Y4iYYzEkKtwvjkpfUuiWDBqxckx2Rse-hnFcKA55aTZoR6pA1am_zmwA2-6cTUhwSN3cOgLaD55BtpaXn8uNj7EawCydo1KHI6Oss8I3RXP3FlWColYlVkOoaCwqPcxXdUZMd4bR1KhHZVwE4C3n0-kjCDoJ8eYq4bMFlugJLcU",
      coverAlt: "Academic textbook style book cover design",
    },
    {
      id: 4,
      title: "The Desert Wind",
      editedAt: "Edited Oct 12, 2023",
      status: "published",
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCcaXwbW9Z0dmqEivWCOEG_YVyDr2kbpRlktEEYiqfRvlV9hlDTPWQ2MRvymLRAOhB0xjzTe4F6BmaCTKe3J0DWpdCyXHvwcW8Zf732ILi0XP5W7XoyrJPsrr8YY-2Zw2dC8px1n9pnFZWatBtB4-inOvKjIWvD50iKxno77I1h-CFek2678oSFwd8ZNbhKWYaYhPrvy-G8x8OT1TX0PZv0qz0FIBfuGm7fUMfyKQNOVc65f_GKfMDvXB6FU_qpXF4d5OGKaExsG0A",
      coverAlt: "Desert sunset landscape book cover photography",
    },
    {
      id: 5,
      title: "Lost in Cordoba",
      editedAt: "Edited Sep 28, 2023",
      status: "published",
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBHmCQ_2YcgYIgzHJVA1UZF48s0emdQpxkZP0TC-4j9cvUsqZcdWXqJCYgx3jss2v7c1cUuKCfa2MLwe-mHVZAKOEWJweVSGyAdaZFfTE6Bpfy_N2nYl4GvqHWXCn_zP9ALjizByoDg4uQm76qAxfUm_cFPhId5qiOu5A5cIzYRFhJp2y4clLmLeoK6XmJZckBPbfN1_DgyAnoHo4rlAbfDEkMzULItC_2IDXcsVUM4nVt40sZraVALWpTmw32Gxi4s_m74im3elGU",
      coverAlt: "Historical architecture theme book cover image",
    },
    {
      id: 6,
      title: "Principles of Fiqh",
      editedAt: "Edited Aug 15, 2023",
      status: "drafts",
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD0JYii34vZKjHJ1FQLguWaT5YnaqRVBWN8OqGKyjI2UfjhHwhXwu_IlEpQ0ITQ18wwgwOs-CkXL0IXX-A1lKn_0oRlu2aTauE0rke3MsZPoc_0HNxev-2pJy4t6z09Dh0UC6knUvFqd5U1J0UWUr9Kx04Kfx7VOJ0a2gTO3Nv1m0zanlUbZYauambutQFI4-sjYhVpAKwqm12fLDOj83UDrQ6WxXeYtYR5em80wtFp4C9P9scOnVDIKVIdZTqaGeXSbKj1ajjMB5c",
      coverAlt: "Old manuscript pattern book cover background",
    },
  ]);

  // --- Computed
  const filteredBooks = computed(() => {
    if (activeTab.value === "all") return books.value;
    return books.value.filter((book) => book.status === activeTab.value);
  });

  // --- Handlers
  function loadMore() {
    // TODO: fetch more books from API
  }

  function createBook() {
    // TODO: open create book dialog
  }

  return {
    activeTab,
    books,
    filteredBooks,
    loadMore,
    createBook,
  };
}
