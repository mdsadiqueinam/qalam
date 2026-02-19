<script setup>
// --- Use ---
// None

// --- Props & models ---
const props = defineProps({
  items: Array,
  compact: {
    type: Boolean,
    default: false,
  },
  square: {
    type: Boolean,
    default: true,
  },
  disabled: {
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

const colorMap = {
  red: 'bg-bad',
  orange: 'bg-past',
  green: 'bg-good',
}
</script>

<template>
  <div
    class="flex shrink-0 select-none flex-nowrap items-center gap-0.5 rounded-xl bg-sidebar-unselected-hover dark:bg-sidebar-selected"
  >
    <button
      v-for="(item, i) in items"
      :key="item.id"
      :disabled="disabled"
      class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-[border,background-color,color,box-shadow] duration-300"
      :class="
        ({
          'h-8 px-3': !compact && !square,
          'h-6 px-2 text-xs': compact && !square,
          'size-8': !compact && square,
          'size-6 text-xs': compact && square,
          'border-r-0': i === 0,
          'border-l-0': i === items.length - 1,
          'pt-[2px]': compact && square && (item.name === 'Y' || item.name === 'N'),
        },
        [
          item.id !== selectedId
            ? 'border-transparent bg-sidebar-unselected-hover dark:bg-sidebar-selected text-sidebar-unselected-text hover:bg-sidebar-hover dark:hover:bg-sidebar hover:text-sidebar-unselected-text-hover disabled:hover:bg-sidebar-unselected disabled:hover:text-sidebar-unselected-text'
            : ['border-divider text-sidebar-unselected', colorMap[item.color]],
        ])
      "
      @click.prevent="selectedId = item.id"
    >
      {{ item.name }}
    </button>
  </div>
</template>
