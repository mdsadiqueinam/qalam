<script setup>
import { ref, onMounted } from "vue";
import { dbReady } from "@root/db/index";
import MainHeader from "@components/layout/MainHeader.vue";
import MainFooter from "@components/layout/MainFooter.vue";

// --- Vars
const isReady = ref(false);

// --- Lifecycle
onMounted(async () => {
  await dbReady;
  isReady.value = true;
});
</script>

<template>
  <!-- Loading screen while DB initialises -->
  <div
    v-if="!isReady"
    class="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-main"
  >
    <div class="spinner" />
    <p class="text-sm font-medium text-main-text-muted">Loading…</p>
  </div>

  <!-- App shell -->
  <div v-else class="flex flex-col h-screen overflow-hidden">
    <MainHeader />

    <main class="flex flex-1 overflow-hidden">
      <RouterView />
    </main>

    <MainFooter />
  </div>
</template>

<style>
/* Global styles can go here */
</style>
