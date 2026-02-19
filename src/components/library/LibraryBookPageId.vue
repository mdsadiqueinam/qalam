<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useDexieLiveQuery } from "@utils/useDexieLiveQuery";
import { db } from "@root/db/index"; // Correct import path for db
import BaseButton from "@shared/components/BaseButton.vue";
import BaseBadge from "@shared/components/BaseBadge.vue"; // Using BaseBadge for status
import TiptapEditor from "@components/editor/TiptapEditor.vue"; // Component for editing content
import {
  ArrowLeftIcon,
  BookOpenIcon,
  BookmarkIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
} from "@heroicons/vue/24/outline";

// --- Props & models ---
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

// --- Use ---
const router = useRouter();
const bookQuery = useDexieLiveQuery(() => db.books.get(props.id), {
  initialValue: null,
});

// --- Vars ---
// N/A

// --- Computed ---
const book = computed(() => bookQuery.value);
// Actually useDexieLiveQuery returns a ref. If the query hasn't run it might be null/undefined depending on usage.
// The utility implementation:
// export function useDexieLiveQuery(querier, { initialValue = [] } = {}) {
//   const value = ref(initialValue); ... }
// So it will be null initially if I passed null.

// --- Handlers ---
function goBack() {
  router.push("/");
}

// Watch for changes and save? Or just let the user edit?
// The requirement is "Book View", but TiptapEditor is an editor.
// I'll bind v-model to a writable computed that updates the DB?
// Updating DB on every keystroke might be too much for Dexie?
// Dexie is fast. But let's verify if we should autosave.
// For now, I will implement it such that TiptapEditor updates a local ref,
// and we can have a save mechanism or autosave.
// Given the tasks, I'll just bind v-model to the book content.
// Wait, `book` is from `useDexieLiveQuery` which is readonly-ish (re-evaluated).
// We should copy content to a local ref when book loads, then save back.
// Actually, `useDexieLiveQuery` updates when DB updates.
// If I use v-model on `book.content`, it won't work directly because `book` is a computed/ref from live query.
// I need a local state.

import { ref, watch } from "vue";

const content = ref("");
const isBookLoaded = ref(false);

watch(
  book,
  (newBook) => {
    if (newBook && !isBookLoaded.value) {
      content.value = newBook.content || "";
      isBookLoaded.value = true;
    }
  },
  { immediate: true },
);

// Auto-save debounce could be added here.
// For now, let's just update the book record when content changes?
// Or maybe just let it be for now and save explicitly?
// The prompt didn't specify editing behavior details, just "use tiptapEditor".
// I'll add a simple autosave watcher.

let saveTimeout = null;
watch(content, (newVal) => {
  if (!isBookLoaded.value || !book.value) return;
  if (newVal === book.value.content) return;

  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    db.books.update(book.value.id, { content: newVal, updatedAt: new Date() });
  }, 1000);
});

// --- Cover Image & Title Updates ---
const fileInput = ref(null);
const isEditingTitle = ref(false);
const titleInput = ref(null);
const localTitle = ref("");

function triggerCoverUpload() {
  fileInput.value.click();
}

function handleCoverImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    db.books.update(props.id, { coverImage: e.target.result });
  };
  reader.readAsDataURL(file);
}

function startEditingTitle() {
  localTitle.value = book.value.title;
  isEditingTitle.value = true;
  // Focus logic needs to wait for DOM update
  setTimeout(() => {
    titleInput.value?.focus();
  }, 0);
}

function saveTitle() {
  if (localTitle.value.trim() && localTitle.value !== book.value.title) {
    db.books.update(props.id, { title: localTitle.value });
  }
  isEditingTitle.value = false;
}

// Formatting dates
function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
</script>

<template>
  <div v-if="book" class="flex min-h-screen bg-main font-display">
    <!-- Sidebar -->
    <aside
      class="hidden lg:flex flex-col w-80 fixed left-0 top-14 bottom-0 border-r border-divider bg-sidebar p-8 overflow-y-auto"
    >
      <div class="flex flex-col gap-6">
        <!-- Cover Image -->
        <div
          class="group aspect-3/4 w-full rounded-xl overflow-hidden shadow-lg shadow-primary/10 bg-primary/5 border border-primary/10 relative"
        >
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleCoverImageUpload"
          />

          <img
            v-if="book.coverImage"
            :class="'w-full h-full object-cover'"
            :src="book.coverImage"
            :alt="book.title"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-primary/30"
          >
            <BookOpenIcon class="w-20 h-20" />
          </div>

          <!-- Edit Overlay -->
          <div
            class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
          >
            <BaseButton
              variant="secondary"
              size="sm"
              class="bg-white/90 hover:bg-white text-main-text shadow-lg"
              @click="triggerCoverUpload"
            >
              <template #icon>
                <CameraIcon class="w-4 h-4" />
              </template>
              Change Cover
            </BaseButton>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Last Updated -->
          <div>
            <h3
              class="text-xs font-bold text-sidebar-text-muted uppercase tracking-widest mb-1"
            >
              Last Updated
            </h3>
            <p class="text-sidebar-text font-medium">
              {{ formatDate(book.updatedAt) }}
            </p>
          </div>

          <!-- Reading Progress (Mocked) -->
          <div>
            <h3
              class="text-xs font-bold text-sidebar-text-muted uppercase tracking-widest mb-1"
            >
              Reading Progress
            </h3>
            <div class="w-full bg-sidebar-unselected h-2 rounded-full mt-2">
              <div
                class="bg-primary h-full rounded-full w-[35%] transition-all"
              ></div>
            </div>
            <p class="text-xs text-sidebar-text-muted mt-1">
              35% completed • Chapter 4
            </p>
          </div>

          <!-- Navigation -->
          <div>
            <h3
              class="text-xs font-bold text-sidebar-text-muted uppercase tracking-widest mb-2"
            >
              Navigation
            </h3>
            <nav class="space-y-1">
              <a
                class="flex items-center gap-3 p-2 rounded-lg bg-primary/10 text-primary font-bold text-sm"
                href="#"
                @click.prevent
              >
                <BookOpenIcon class="w-5 h-5" />
                Read Content
              </a>
              <a
                class="flex items-center gap-3 p-2 rounded-lg text-sidebar-text hover:bg-sidebar-hover font-medium text-sm transition-colors"
                href="#"
                @click.prevent
              >
                <BookmarkIcon class="w-5 h-5" />
                Bookmarks
              </a>
              <a
                class="flex items-center gap-3 p-2 rounded-lg text-sidebar-text hover:bg-sidebar-hover font-medium text-sm transition-colors"
                href="#"
                @click.prevent
              >
                <PencilSquareIcon class="w-5 h-5" />
                My Notes
              </a>
            </nav>
          </div>
        </div>

        <!-- Quote (Static from template) -->
        <div
          class="mt-auto p-4 bg-sidebar-unselected rounded-xl border border-dashed border-divider-outline"
        >
          <p class="text-[11px] text-sidebar-text-muted leading-relaxed italic">
            "When you want something, all the universe conspires in helping you
            to achieve it."
          </p>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main
      class="flex-1 lg:ml-80 transition-all duration-300 flex flex-col h-full"
    >
      <!-- Reading Progress Bar (Top) -->
      <div class="sticky top-0 left-0 right-0 h-0.5 bg-divider z-40">
        <div class="bg-primary h-full w-[35%]"></div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="max-w-3xl mx-auto px-6 py-12 md:py-20">
          <!-- Top Navigation (Mobile/Back) -->
          <div class="mb-8 flex items-center justify-between">
            <BaseButton
              variant="text"
              size="sm"
              class="gap-2 pl-0 text-main-text-muted hover:text-primary"
              @click="goBack"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              Back to Library
            </BaseButton>

            <!-- Mobile Menu Button (Placeholder) -->
            <!-- <BaseButton iconOnly variant="ghost" class="lg:hidden">
                       <ListBulletIcon class="w-6 h-6" />
                   </BaseButton> -->
          </div>

          <!-- Book Header -->
          <div class="text-center mb-10" dir="rtl">
            <BaseBadge variant="info" showStatusDot class="mb-4"
              >Active</BaseBadge
            >
            <div v-if="isEditingTitle" class="mt-4">
              <input
                ref="titleInput"
                v-model="localTitle"
                class="w-full text-4xl md:text-5xl font-bold text-center bg-transparent border-b-2 border-primary focus:outline-none text-main-text font-display py-2"
                @blur="saveTitle"
                @keydown.enter="saveTitle"
              />
            </div>
            <h1
              v-else
              class="text-4xl md:text-5xl font-bold mt-4 leading-tight text-main-text font-display cursor-pointer hover:text-primary/80 transition-colors"
              title="Click to edit title"
              @click="startEditingTitle"
            >
              {{ book.title }}
            </h1>
            <div class="flex justify-center gap-2 mt-6">
              <div class="size-1 rounded-full bg-primary/40"></div>
              <div class="size-1 rounded-full bg-primary"></div>
              <div class="size-1 rounded-full bg-primary/40"></div>
            </div>
          </div>

          <!-- Editor Content -->
          <div class="arabic-content min-h-[500px]">
            <TiptapEditor v-model="content" placeholder="Start writing..." />
          </div>

          <!-- Footer Navigation -->
          <div
            class="flex flex-col items-center gap-8 pt-12 border-t border-divider mt-16"
          >
            <div class="flex items-center gap-4">
              <BaseButton variant="secondary" class="rounded-full!">
                <template #icon>
                  <ChevronLeftIcon class="w-5 h-5" />
                </template>
                Previous Chapter
              </BaseButton>
              <BaseButton
                variant="primary"
                class="rounded-full! shadow-lg shadow-primary/20"
              >
                Next Chapter
                <template #iconRight>
                  <ChevronRightIcon class="w-5 h-5" />
                </template>
              </BaseButton>
            </div>
            <p class="text-main-text-muted text-sm font-medium">
              Page 84 of 212
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="spinner"></div>
  </div>
</template>
