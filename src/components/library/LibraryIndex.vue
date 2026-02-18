<script setup>
import { useLibrary } from "@composables/useLibrary";
import LibraryBookCard from "@components/library/LibraryBookCard.vue";
import LibraryEmptyCard from "@components/library/LibraryEmptyCard.vue";
import LibraryTabs from "@components/library/LibraryTabs.vue";
import { PlusIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";

// --- Use
const { activeTab, filteredBooks, loadMore, createBook } = useLibrary();
</script>

<template>
  <div
    class="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark"
  >
    <div class="max-w-[1200px] mx-auto w-full px-6 py-8">
      <!-- Page Header -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1
            class="text-4xl font-bold text-slate-900 dark:text-white font-display mb-2"
          >
            My Library
          </h1>
          <p class="text-slate-500 font-sans">
            Manage your Arabic literary projects and manuscripts in one place.
          </p>
        </div>
        <button
          class="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white font-bold font-sans hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          @click="createBook"
        >
          <PlusIcon class="w-5 h-5" />
          <span>Create New Book</span>
        </button>
      </div>

      <!-- Tabs -->
      <LibraryTabs v-model="activeTab" />

      <!-- Book Grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <!-- Create New Card -->
        <LibraryEmptyCard @create="createBook" />

        <!-- Book Cards -->
        <LibraryBookCard
          v-for="book in filteredBooks"
          :key="book.id"
          :title="book.title"
          :editedAt="book.editedAt"
          :coverUrl="book.coverUrl"
          :coverAlt="book.coverAlt"
        />
      </div>

      <!-- Load More -->
      <div class="mt-12 flex justify-center font-sans">
        <button
          class="flex items-center gap-2 px-6 py-3 bg-white dark:bg-background-dark/50 border border-primary/20 rounded-lg text-primary font-bold hover:bg-primary/5 transition-colors"
          @click="loadMore"
        >
          Load More Books
          <ChevronDownIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
