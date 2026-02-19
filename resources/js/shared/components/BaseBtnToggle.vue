<script setup>
import { RouterLink } from 'vue-router'

// --- Use ---
// None

// --- Props & models ---
const props = defineProps({
  items: Array,
  compact: {
    type: Boolean,
    default: false,
  },
})
const selectedId = defineModel('selectedId')

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
  <div
    class="flex shrink-0 select-none flex-nowrap items-center gap-0.5 rounded-xl bg-main-unselected"
  >
    <component
      :is="item.to ? RouterLink : 'button'"
      v-for="(item, i) in items"
      :key="item.id"
      :to="item.id"
      class="inline-flex h-8 cursor-pointer items-center gap-2 rounded-xl border transition-[border,background-color,color,opacity,box-shadow] duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
      :class="{
        'px-3': !compact,
        'px-2.5': compact,
        'border-transparent bg-main-unselected text-main-unselected-text hover:bg-main-unselected-hover hover:text-main-text-hover':
          item.id !== selectedId,
        'border-primary bg-primary-light text-primary-text dark:bg-primary-dark/30 dark:text-primary':
          item.id === selectedId,
        'border-r-0': i === 0,
        'border-l-0': i === items.length - 1,
      }"
      @click.prevent="selectedId = item.id"
    >
      <component
        v-if="item.icon"
        :is="item.icon"
        class="size-4"
        :style="item.iconColor ? 'color:' + item.iconColor : ''"
      />
      {{ item.name }}
      <span
        v-if="item.badge"
        class="-mr-1 inline-flex shrink-0 cursor-pointer flex-row items-center gap-1 overflow-hidden rounded-xl border border-solid border-divider bg-sidebar px-2 py-0.5 text-xs"
      >
        {{ item.badge }}
      </span>
    </component>
  </div>
</template>
