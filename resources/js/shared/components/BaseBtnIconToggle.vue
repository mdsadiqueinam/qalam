<script setup>
import { RouterLink } from 'vue-router'

// --- Use ---
// None

// --- Props & models ---
const props = defineProps({
  items: Array,
  selectedId: String,
})

// --- Emits ---
const emit = defineEmits(['update:selectedId'])

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
  <div class="flex items-center flex-nowrap shrink-0 bg-main-unselected rounded-xl gap-px">
    <BaseTooltip v-for="(item, i) in items" :key="item.id">
      <div
        class="inline-flex items-center border px-3 h-8 text-sm border-divider transition-[border,background-color,color,opacity,box-shadow] duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
        :class="{
          'border-transparent text-main-unselected-text hover:bg-main-unselected-hover hover:text-main-text-hover':
            item.id !== props.selectedId,
          'border-primary bg-primary-light text-primary-text dark:bg-primary-dark/30 dark:text-primary':
            item.id === props.selectedId,
          'rounded-l-xl border-r-0': i === 0,
          'rounded-r-xl border-l-0': i === items.length - 1,
        }"
        @click="emit('update:selectedId', item.id)"
      >
        <component :is="item.icon" class="size-4" />
      </div>
      <template #content>{{ item.name }}</template>
    </BaseTooltip>
  </div>
</template>
