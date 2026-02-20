<script setup>
import { useRouter } from "vue-router";
import { db } from "@root/db/index"; // Correct import path for db
import {
  ArrowLeftIcon,
  BookOpenIcon,
  BookmarkIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
  PhotoIcon,
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
const book = useDexieLiveQuery(() => db.books.get(props.id), {
  initialValue: null,
});

// --- Vars ---
// N/A

// --- Computed ---

// --- Handlers ---
function goBack() {
  router.push("/");
}

const debouncedSave = useDebounceFn(() => {
  if (!book.value) return;
  book.value.updatedAt = new Date();
  book.value.save();
}, 1000);

// --- Cover Image & Title Updates ---
const isEditingTitle = ref(false);
const titleInput = ref(null);
const showCoverDialog = ref(false);
const coverUrlInput = ref("");
const fileInput = ref(null);

function triggerCoverUpload() {
  coverUrlInput.value = book.value.coverImage || "";
  showCoverDialog.value = true;
}

function triggerFileSelect() {
  fileInput.value?.click();
}

function handleCoverImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    book.value.coverImage = e.target.result;
    book.value.save();
    showCoverDialog.value = false;
  };
  reader.readAsDataURL(file);
}

function saveCoverUrl() {
  book.value.coverImage = coverUrlInput.value;
  book.value.save();
  showCoverDialog.value = false;
}

function startEditingTitle() {
  isEditingTitle.value = true;
  // Focus logic needs to wait for DOM update
  setTimeout(() => {
    titleInput.value?.focus();
  }, 0);
}

function saveTitle() {
  if (book.value.title.trim() === "") {
    book.value.title = "Untitled Book";
  }
  book.value.save();
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
  <div v-if="book" class="flex min-h-screen bg-main font-display flex-1">
    <!-- Sidebar -->
    <aside
      class="hidden lg:flex flex-col w-80 fixed left-0 top-14 bottom-0 border-r border-divider bg-sidebar p-8 overflow-y-auto"
    >
      <div class="flex flex-col gap-6">
        <!-- Cover Image -->
        <div
          class="group aspect-3/4 w-full rounded-xl overflow-hidden shadow-lg shadow-primary/10 bg-primary/5 border border-primary/10 relative"
        >
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
                v-model="book.title"
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
            <TiptapEditor
              v-model="book.content"
              placeholder="Start writing..."
              @update:modelValue="debouncedSave"
            />
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

    <!-- Cover Image Dialog -->
    <BaseDialog
      v-model="showCoverDialog"
      name="Change Cover Image"
      :show="showCoverDialog"
      :onSubmit="saveCoverUrl"
      @close="showCoverDialog = false"
    >
      <div class="flex flex-col gap-4 w-72">
        <BaseTextInput
          v-model="coverUrlInput"
          label="Cover Image URL"
          name="cover-url"
          placeholder="https://..."
        />

        <div class="flex items-center">
          <div class="h-px bg-divider flex-1"></div>
          <span class="px-3 text-xs text-main-text-muted font-medium">OR</span>
          <div class="h-px bg-divider flex-1"></div>
        </div>

        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleCoverImageUpload"
        />
        <BaseButton
          variant="secondary"
          class="w-full justify-center"
          @click="triggerFileSelect"
        >
          <template #icon>
            <PhotoIcon class="w-4 h-4" />
          </template>
          Upload from device
        </BaseButton>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="showCoverDialog = false">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" @click="saveCoverUrl">
          Save Cover
        </BaseButton>
      </template>
    </BaseDialog>
  </div>
  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="spinner"></div>
  </div>
</template>
