<script setup>
import { ref } from "vue";
import TiptapEditor from "@components/editor/TiptapEditor.vue";
import ArabicKeyboard from "@components/studio/ArabicKeyboard.vue";

// --- Vars (ref, reactive)
const tiptapEditor = ref(null);

// --- Computed
// Word count is now handled inside TiptapEditor

function handleKeyPress(key) {
  if (!tiptapEditor.value) return;
  tiptapEditor.value.insertText(key);
}
</script>

<template>
  <div class="flex flex-1 flex-col bg-main overflow-hidden">
    <!-- Text Editor Area -->
    <div class="flex flex-1 flex-col p-6 overflow-hidden">
      <div
        class="mx-auto flex w-full max-w-4xl flex-1 flex-col rounded-xl border border-border-default bg-sidebar shadow-sm overflow-hidden"
      >
        <!-- Tiptap Editor -->
        <TiptapEditor ref="tiptapEditor" />
      </div>
    </div>

    <!-- On-Screen Keyboard -->
    <ArabicKeyboard @keyPress="handleKeyPress" />
  </div>
</template>
