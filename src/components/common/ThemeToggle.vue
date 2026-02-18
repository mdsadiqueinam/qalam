<script setup>
import { useDark, useToggle } from "@vueuse/core";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";

// --- Use (composables/utils)
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <button
    class="flex items-center justify-center w-10 h-10 rounded-lg text-sidebar-text hover:bg-primary/10 hover:text-primary transition-colors"
    aria-label="Toggle theme"
    @click="toggleDark()"
  >
    <SunIcon v-if="isDark" class="w-5 h-5 transition-transform duration-200" />
    <MoonIcon v-else class="w-5 h-5 transition-transform duration-200" />
  </button>
</template>
