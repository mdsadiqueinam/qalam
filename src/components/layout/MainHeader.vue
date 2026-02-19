<script setup>
import {
  BookOpenIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { ref } from "vue";

// --- Vars
const searchQuery = ref("");

const tabs = [{ label: "My library", icon: Squares2X2Icon, to: "/" }];
</script>

<template>
  <header
    class="flex h-14 items-center justify-between border-b border-divider bg-sidebar px-6 shrink-0"
  >
    <div class="flex flex-nowrap items-center">
      <div class="flex items-center gap-3">
        <div class="bg-primary p-1.5 rounded-lg text-primary-text">
          <BookOpenIcon class="w-5 h-5" />
        </div>
        <h1
          class="font-display text-lg font-bold text-sidebar-text-selected tracking-tight"
        >
          Qalam
        </h1>
      </div>

      <!-- Vertical separator -->
      <div class="h-8 w-px bg-divider ms-4 me-1"></div>

      <nav class="flex items-center gap-1">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-sidebar-text hover:text-primary hover:bg-primary/10 transition-colors"
          activeClass="!text-primary bg-primary/10"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </RouterLink>
      </nav>
    </div>

    <div class="flex items-center gap-4">
      <!-- Search bar (hidden on mobile) -->
      <div class="hidden sm:flex items-center h-8 w-48 lg:w-64">
        <BaseTextInput
          v-model="searchQuery"
          placeholder="Search manuscripts..."
          size="sm"
          clearBtn
        >
          <template #icon>
            <MagnifyingGlassIcon class="w-4 h-4 text-primary/50 shrink-0" />
          </template>
        </BaseTextInput>
      </div>

      <!-- Teleport target for dynamic header content -->
      <div id="header-content" class="flex items-center gap-4"></div>

      <ThemeToggle />
    </div>
  </header>
</template>
