<script setup>
import { ref, computed } from "vue";
import EditorToolbar from "@components/studio/EditorToolbar.vue";
import EditorCanvas from "@components/studio/EditorCanvas.vue";
import ArabicKeyboard from "@components/studio/ArabicKeyboard.vue";

// --- Vars (ref, reactive)
const editorText = ref("");
const selectedFont = ref("Noto Serif (Arabic)");
const keyboardVisible = ref(true);

// --- Computed
const wordCount = computed(() => {
  if (!editorText.value) return 0;
  const words = editorText.value.trim().split(/\s+/);
  return words.filter((word) => word.length > 0).length;
});

// --- Handlers
function handleFormat(type) {
  console.log("Format:", type);
  // TODO: Implement formatting logic when using rich text editor
}

function handleAlign(alignment) {
  console.log("Align:", alignment);
  // TODO: Implement alignment logic when using rich text editor
}

function handleList() {
  console.log("List formatting");
  // TODO: Implement list formatting when using rich text editor
}

function handleFontChange(font) {
  selectedFont.value = font;
}

function handleKeyPress(char) {
  if (char === "BACKSPACE") {
    editorText.value = editorText.value.slice(0, -1);
  } else if (
    char === "ARROW_LEFT" ||
    char === "ARROW_RIGHT" ||
    char === "ARROW_UP" ||
    char === "ARROW_DOWN"
  ) {
    // Arrow keys - would need cursor position tracking for full implementation
    console.log("Arrow key:", char);
  } else if (char) {
    editorText.value += char;
  }
}

function handleToggleKeyboard() {
  keyboardVisible.value = !keyboardVisible.value;
}
</script>

<template>
  <main class="flex flex-1 flex-col bg-main overflow-hidden">
    <!-- Text Editor Area -->
    <div class="flex flex-1 flex-col p-6 overflow-hidden">
      <div
        class="mx-auto flex w-full max-w-4xl flex-1 flex-col rounded-xl border border-border-default bg-sidebar shadow-sm overflow-hidden"
      >
        <!-- Toolbar -->
        <EditorToolbar
          :selectedFont="selectedFont"
          :wordCount="wordCount"
          @align="handleAlign"
          @fontChange="handleFontChange"
          @format="handleFormat"
          @list="handleList"
        />

        <!-- Editor Canvas -->
        <EditorCanvas v-model="editorText" />
      </div>
    </div>

    <!-- On-Screen Keyboard -->
    <ArabicKeyboard
      :visible="keyboardVisible"
      @keyPress="handleKeyPress"
      @toggle="handleToggleKeyboard"
    />
  </main>
</template>
