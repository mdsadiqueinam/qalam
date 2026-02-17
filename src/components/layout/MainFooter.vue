<script setup>
import { LanguageIcon, DocumentTextIcon } from "@heroicons/vue/outline";

// --- Props & models
defineProps({
  syncActive: {
    type: Boolean,
    default: true,
  },
  lastSaved: {
    type: String,
    default: "",
  },
  transliterationMode: {
    type: String,
    default: "EN → AR TRANSLITERATION",
  },
  fontName: {
    type: String,
    default: "NOTO SERIF",
  },
  edition: {
    type: String,
    default: "PRO EDITION",
  },
});
</script>

<template>
  <footer
    class="flex h-8 items-center justify-between bg-white dark:bg-sidebar px-4 border-t border-slate-200 dark:border-divider shrink-0"
  >
    <div
      class="flex items-center gap-4 text-[10px] font-medium text-slate-400 dark:text-slate-500"
    >
      <div v-if="syncActive" class="flex items-center gap-1.5">
        <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
        LIVE SYNC ACTIVE
      </div>
      <div v-if="lastSaved">{{ lastSaved }}</div>
    </div>
    <div
      class="flex items-center gap-6 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter"
    >
      <div class="flex items-center gap-1">
        <LanguageIcon class="w-3 h-3" />
        {{ transliterationMode }}
      </div>
      <div class="flex items-center gap-1">
        <DocumentTextIcon class="w-3 h-3" />
        {{ fontName }}
      </div>
      <div class="text-primary">{{ edition }}</div>
    </div>
  </footer>
</template>
