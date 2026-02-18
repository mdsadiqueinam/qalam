<script setup>
import { ref, computed } from "vue";
import EditorToolbar from "@components/studio/EditorToolbar.vue";
import TiptapEditor from "@components/editor/TiptapEditor.vue";
import ArabicKeyboard from "@components/studio/ArabicKeyboard.vue";

// --- Vars (ref, reactive)
const tiptapEditor = ref(null);
const selectedFont = ref("Noto Naskh Arabic");

// --- Computed
const wordCount = computed(() => {
  const text = tiptapEditor.value?.editor?.getText() ?? "";
  if (!text.trim()) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
});

// --- Handlers
function handleFontChange(font) {
  selectedFont.value = font;
}

function handleKeyPress(key) {
  if (!tiptapEditor.value) return;
  if (key.type === "special") {
    if (key.code === "Backspace") {
      tiptapEditor.value.deleteChar();
    } else if (key.code === "Enter") {
      tiptapEditor.value.editor?.chain().focus().splitBlock().run();
    } else if (key.code === "Space") {
      tiptapEditor.value.insertText(" ");
    }
    return;
  }
  if (key.englishKey) {
    // TODO: insert arabic char when arabicKey is wired
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col bg-main overflow-hidden">
    <!-- Text Editor Area -->
    <div class="flex flex-1 flex-col p-6 overflow-hidden">
      <div
        class="mx-auto flex w-full max-w-4xl flex-1 flex-col rounded-xl border border-border-default bg-sidebar shadow-sm overflow-hidden"
      >
        <!-- Toolbar -->
        <EditorToolbar
          :selectedFont="selectedFont"
          :wordCount="wordCount"
          @fontChange="handleFontChange"
        />

        <!-- Tiptap Editor -->
        <TiptapEditor ref="tiptapEditor" :font="selectedFont" />
      </div>
    </div>

    <!-- On-Screen Keyboard -->
    <ArabicKeyboard @keyPress="handleKeyPress" />
  </div>
</template>
