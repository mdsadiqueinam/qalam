<script setup>
import { TabPanel } from '@headlessui/vue'

// --- Use ---
// None

// --- Props & models ---
// None

// --- Emits ---
// None

// --- Vars ---
// None

// --- Handlers ---
// None

// --- Watchers & computed ---
// None

// --- Lifecycle hooks & related ---
// None
</script>

<template>
  <TabPanel
    class="dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-lg"
  >
    <slot></slot>
  </TabPanel>
</template>
