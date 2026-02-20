<script setup>
import { reactive, ref } from "vue";
import { GlobeAltIcon, LockClosedIcon } from "@heroicons/vue/24/outline";
import { db } from "@root/db/index";
import { currentUser } from "@root/firebase/auth";

// --- Vars (ref, reactive)
const modelValue = defineModel({ type: Boolean, default: false });

const form = reactive({
  title: "",
  coverImage: "",
  isPublic: false,
});
const isLoading = ref(false);
const errorMsg = ref("");

// --- Handlers
function close() {
  modelValue.value = false;
  form.title = "";
  form.coverImage = "";
  form.isPublic = false;
  errorMsg.value = "";
}

async function handleSubmit() {
  errorMsg.value = "";

  if (!form.title.trim()) {
    errorMsg.value = "Book title is required.";
    return;
  }

  isLoading.value = true;
  try {
    const book = new db.Book({
      title: form.title.trim(),
      coverImage: form.coverImage.trim() || undefined,
      isPublic: form.isPublic,
      // Set the owner's Firebase UID so access rules can be enforced.
      // Null for guest users who are not authenticated.
      userId: currentUser.value?.uid ?? null,
    });
    const success = await book.create();
    if (success) {
      close();
    } else {
      errorMsg.value = "Failed to create book. Please try again.";
    }
  } catch {
    errorMsg.value = "An unexpected error occurred.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <BaseDialog
    v-model="modelValue"
    name="New Book"
    :show="modelValue"
    :onSubmit="handleSubmit"
    @close="close"
  >
    <!-- Body -->
    <div class="flex flex-col gap-4 w-72">
      <BaseTextInput
        v-model="form.title"
        label="Title"
        name="book-title"
        placeholder="e.g. Diwan al-Mutanabbi"
        :errorMsg="errorMsg"
        :disabled="isLoading"
        required
        autofocus
      />
      <BaseTextInput
        v-model="form.coverImage"
        label="Cover Image URL"
        name="book-cover-image"
        placeholder="https://..."
        :disabled="isLoading"
      />

      <!-- Visibility toggle -->
      <div class="flex flex-col gap-1">
        <span class="text-sm font-medium text-main-text">Visibility</span>
        <button
          type="button"
          class="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors"
          :class="
            form.isPublic
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border-subtle bg-sidebar text-main-text'
          "
          :disabled="isLoading"
          @click="form.isPublic = !form.isPublic"
        >
          <component
            :is="form.isPublic ? GlobeAltIcon : LockClosedIcon"
            class="w-5 h-5 shrink-0"
          />
          <div>
            <p class="text-sm font-semibold leading-none mb-0.5">
              {{ form.isPublic ? "Public" : "Private" }}
            </p>
            <p class="text-xs text-main-text-muted leading-snug">
              {{
                form.isPublic
                  ? "Visible to all users"
                  : "Only visible to you"
              }}
            </p>
          </div>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <BaseButton variant="secondary" :disabled="isLoading" @click="close">
        Cancel
      </BaseButton>
      <BaseButton
        variant="primary"
        :isLoading="isLoading"
        @click="handleSubmit"
      >
        Create Book
      </BaseButton>
    </template>
  </BaseDialog>
</template>
