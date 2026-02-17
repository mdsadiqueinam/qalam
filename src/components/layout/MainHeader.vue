<script setup>
import { BookOpenIcon } from "@heroicons/vue/outline";
import ThemeToggle from "@components/common/ThemeToggle.vue";
</script>

<template>
  <header
    class="flex h-16 items-center justify-between border-b border-divider bg-sidebar px-6 py-3 shrink-0"
  >
    <div class="flex items-center gap-3">
      <div class="bg-primary p-1.5 rounded-lg text-primary-text">
        <BookOpenIcon class="w-6 h-6" />
      </div>
      <h1
        class="font-display text-xl font-bold text-sidebar-text-selected tracking-tight"
      >
        Qalam
      </h1>
    </div>

    <div class="flex items-center gap-4">
      <!-- Teleport target for dynamic header content -->
      <div id="header-content" class="flex items-center gap-4"></div>

      <ThemeToggle />
    </div>
  </header>
</template>
