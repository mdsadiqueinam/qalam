<script setup>
import {
  Bars3BottomRightIcon,
  Bars3CenterLeftIcon,
  Bars3BottomLeftIcon,
  ListBulletIcon,
} from "@heroicons/vue/24/outline";

// --- Props & models
defineProps({
  selectedFont: {
    type: String,
    default: "Noto Serif (Arabic)",
  },
  wordCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["format", "align", "list", "font-change"]);

// --- Handlers
function handleFormat(type) {
  emit("format", type);
}

function handleAlign(alignment) {
  emit("align", alignment);
}

function handleList() {
  emit("list");
}

function handleFontChange(event) {
  emit("font-change", event.target.value);
}
</script>

<template>
  <div
    class="flex items-center justify-between border-b border-divider-subtle bg-main-unselected px-3 py-1 shrink-0"
  >
    <div class="flex items-center gap-0.5">
      <!-- Bold Button (using B text) -->
      <button
        class="p-1.5 text-xs text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all font-bold"
        @click="handleFormat('bold')"
      >
        B
      </button>

      <!-- Italic Button (using I text) -->
      <button
        class="p-1.5 text-xs text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all italic font-serif"
        @click="handleFormat('italic')"
      >
        I
      </button>

      <!-- Underline Button (using U text) -->
      <button
        class="p-1.5 text-xs text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all underline"
        @click="handleFormat('underline')"
      >
        U
      </button>

      <div class="mx-1 h-4 w-px bg-divider" />

      <!-- Align Right -->
      <button
        class="p-1.5 text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all"
        @click="handleAlign('right')"
      >
        <Bars3BottomRightIcon class="w-4 h-4" />
      </button>

      <!-- Align Center -->
      <button
        class="p-1.5 text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all"
        @click="handleAlign('center')"
      >
        <Bars3CenterLeftIcon class="w-4 h-4" />
      </button>

      <!-- Align Left -->
      <button
        class="p-1.5 text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all"
        @click="handleAlign('left')"
      >
        <Bars3BottomLeftIcon class="w-4 h-4" />
      </button>

      <div class="mx-1 h-4 w-px bg-divider" />

      <!-- Bullet List -->
      <button
        class="p-1.5 text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all"
        @click="handleList"
      >
        <ListBulletIcon class="w-4 h-4" />
      </button>
    </div>

    <div class="flex items-center gap-3">
      <!-- Font Selector -->
      <select
        class="rounded border-none bg-transparent text-xs font-medium text-main-text-muted focus:ring-0 cursor-pointer"
        :value="selectedFont"
        @change="handleFontChange"
      >
        <option>Noto Serif (Arabic)</option>
        <option>Amiri</option>
        <option>Traditional Arabic</option>
      </select>

      <div class="h-4 w-px bg-divider" />

      <!-- Word Count -->
      <span class="text-xs font-medium text-main-text-muted">
        {{ wordCount }} Words
      </span>
    </div>
  </div>
</template>
