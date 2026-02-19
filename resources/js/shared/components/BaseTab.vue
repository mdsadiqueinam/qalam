<script setup>
import { Tab } from '@headlessui/vue'

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
  <Tab v-slot="{ selected }" as="template">
    <button
      class="flex-1 pb-3 text-sm flex justify-center font-medium border-b-2 transition-colors whitespace-nowrap focus:outline-none"
      :class="{
        'border-primary text-primary font-semibold': selected,
        'text-main-text-muted border-transparent hover:border-divider-hover hover:text-main-text':
          !selected,
      }"
    >
      <slot :selected="selected"></slot>
    </button>
  </Tab>
</template>
