<script setup>
import { ref } from "vue";
import { PlusIcon } from "@heroicons/vue/24/outline";

// --- Use
const { activeTab, filteredBooks } = useLibrary();

// --- Vars
const showCreateDialog = ref(false);

function createBook() {
  showCreateDialog.value = true;
}
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-main">
    <div class="max-w-[1200px] mx-auto w-full px-6 py-8">
      <!-- Page Header -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1 class="text-4xl font-bold text-main-text font-display mb-2">
            My Library
          </h1>
          <p class="text-main-text-muted font-sans">
            Manage your Arabic literary projects and manuscripts in one place.
          </p>
        </div>
        <BaseButton @click="createBook">
          <template #icon>
            <PlusIcon class="w-5 h-5" />
          </template>
          <span>Create New Book</span>
        </BaseButton>
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
          :book="book"
        />
      </div>
    </div>
  </div>

  <LibraryCreateBookDialog v-model="showCreateDialog" />
</template>
