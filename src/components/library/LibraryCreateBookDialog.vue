<script setup>
import { reactive, ref } from "vue";
import { db } from "@root/db/index";

// --- Vars (ref, reactive)
const modelValue = defineModel({ type: Boolean, default: false });

const form = reactive({
  title: "",
  coverImage: "",
});
const isLoading = ref(false);
const errorMsg = ref("");

// --- Handlers
function close() {
  modelValue.value = false;
  form.title = "";
  form.coverImage = "";
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
