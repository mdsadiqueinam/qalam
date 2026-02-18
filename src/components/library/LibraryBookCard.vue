<script setup>
import { EllipsisVerticalIcon } from "@heroicons/vue/24/outline";

// --- Props & models
defineProps({
  title: {
    type: String,
    required: true,
  },
  editedAt: {
    type: String,
    default: "",
  },
  coverUrl: {
    type: String,
    default: "",
  },
  coverAlt: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["edit", "menu"]);
</script>

<template>
  <div
    class="group flex flex-col bg-white dark:bg-background-dark/50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/20 cursor-pointer"
  >
    <div class="relative aspect-3/4 overflow-hidden">
      <!-- Hover overlay -->
      <div
        class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
      >
        <button
          class="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm w-full font-sans"
          @click.stop="emit('edit')"
        >
          Edit Manuscript
        </button>
      </div>

      <!-- Cover image -->
      <img
        :alt="coverAlt || title"
        :src="coverUrl"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Three-dot menu -->
      <div class="absolute top-2 right-2 z-20">
        <button
          class="p-1 rounded bg-white/80 text-slate-700 hover:bg-white transition-colors"
          @click.stop="emit('menu')"
        >
          <EllipsisVerticalIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="p-4">
      <h3
        class="font-bold text-slate-900 dark:text-white leading-tight font-display mb-1 truncate"
      >
        {{ title }}
      </h3>
      <p class="text-xs text-slate-500 font-sans">{{ editedAt }}</p>
    </div>
  </div>
</template>
