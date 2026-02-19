<script setup>
import {
  Bars3BottomRightIcon,
  Bars3CenterLeftIcon,
  Bars3BottomLeftIcon,
  ListBulletIcon,
} from "@heroicons/vue/24/outline";

// --- Props & models
defineProps({
  wordCount: {
    type: Number,
    default: 0,
  },
});
const font = defineModel("font", {
  type: String,
  default: "Noto Serif (Arabic)",
});
const formats = defineModel("formats", { type: Array, default: () => [] });
const align = defineModel("align", { type: String, default: "right" });
const list = defineModel("list", { type: Boolean, default: false });

// --- Handlers
function toggleFormat(type) {
  if (formats.value.includes(type)) {
    formats.value = formats.value.filter((f) => f !== type);
  } else {
    formats.value = [...formats.value, type];
  }
}

function setAlign(alignment) {
  align.value = alignment;
}

function toggleList() {
  list.value = !list.value;
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
        :class="{ 'bg-primary/10 text-primary': formats.includes('bold') }"
        @click="toggleFormat('bold')"
      >
        B
      </button>

      <!-- Italic Button (using I text) -->
      <button
        class="p-1.5 text-xs text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all italic font-serif"
        :class="{ 'bg-primary/10 text-primary': formats.includes('italic') }"
        @click="toggleFormat('italic')"
      >
        I
      </button>

      <!-- Underline Button (using U text) -->
      <button
        class="p-1.5 text-xs text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all underline"
        :class="{ 'bg-primary/10 text-primary': formats.includes('underline') }"
        @click="toggleFormat('underline')"
      >
        U
      </button>

      <div class="mx-1 h-4 w-px bg-divider" />

      <!-- Align Right -->
      <button
        class="p-1.5 text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all"
        :class="{ 'bg-primary/10 text-primary': align === 'right' }"
        @click="setAlign('right')"
      >
        <Bars3BottomRightIcon class="w-4 h-4" />
      </button>

      <!-- Align Center -->
      <button
        class="p-1.5 text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all"
        :class="{ 'bg-primary/10 text-primary': align === 'center' }"
        @click="setAlign('center')"
      >
        <Bars3CenterLeftIcon class="w-4 h-4" />
      </button>

      <!-- Align Left -->
      <button
        class="p-1.5 text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all"
        :class="{ 'bg-primary/10 text-primary': align === 'left' }"
        @click="setAlign('left')"
      >
        <Bars3BottomLeftIcon class="w-4 h-4" />
      </button>

      <div class="mx-1 h-4 w-px bg-divider" />

      <!-- Bullet List -->
      <button
        class="p-1.5 text-sidebar-text hover:bg-sidebar hover:text-primary rounded transition-all"
        :class="{ 'bg-primary/10 text-primary': list }"
        @click="toggleList"
      >
        <ListBulletIcon class="w-4 h-4" />
      </button>
    </div>

    <div class="flex items-center gap-3">
      <!-- Font Selector -->
      <select
        v-model="font"
        class="rounded border-none bg-transparent text-xs font-medium text-main-text-muted focus:ring-0 cursor-pointer"
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
