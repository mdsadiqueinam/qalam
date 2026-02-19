<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

// --- Use ---
const breakpoints = useBreakpoints(breakpointsTailwind)

// --- Props & models ---
const props = defineProps({
  items: Array,
  compact: {
    type: Boolean,
    default: false,
  },
  maxItems: {
    type: Number,
    default: null,
  },
})
const selectedId = defineModel('selectedId')

// --- Emits ---
// None

// --- Vars ---
const isSmAndUp = breakpoints.greaterOrEqual('sm')

// --- Handlers ---
function onSelectChange(event) {
  selectedId.value = event.target.value
}

// --- Watchers & computed ---
// None

// --- Lifecycle hooks & related ---
// None
</script>

<template>
  <!-- Desktop/Tablet: Show tabs using BaseTabToggle -->
  <BaseTabToggle
    v-if="isSmAndUp"
    v-model:selectedId="selectedId"
    :items="items"
    :compact="compact"
    :maxItems="maxItems"
  />

  <!-- Mobile: Show select dropdown -->
  <div v-else class="relative flex h-8 shrink-0 items-center">
    <select
      :value="selectedId"
      @change="onSelectChange"
      class="inline-flex h-8 w-full select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-divider bg-main py-0 text-sm text-sidebar-text transition-[border,background-color,color,opacity] duration-300 hover:border-divider-hover hover:bg-sidebar-unselected-hover hover:text-sidebar-text-hover disabled:cursor-not-allowed disabled:opacity-80"
    >
      <option v-for="item in items" :key="item.id" :value="item.id" class="text-main-text">
        {{ item.name }}
      </option>
    </select>
    <ChevronDownIcon
      class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-main-unselected-text"
    />
  </div>
</template>
