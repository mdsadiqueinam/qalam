<script setup>
import { XCircleIcon } from '@heroicons/vue/24/outline'
// --- Use ---
// None

// --- Props & models ---
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  removable: {
    type: Boolean,
    default: true,
  },
})

// --- Emits ---
const emit = defineEmits(['onRemove'])

// --- Vars ---
// None

// --- Handlers ---
function onRemove() {
  emit('onRemove')
}

// --- Watchers & computed ---
// None

// --- Lifecycle hooks & related ---
// None
</script>

<template>
  <div class="flex">
    <div
      class="inline-flex h-8 items-center gap-1 rounded-xl border border-r-0 border-divider bg-main-unselected px-3 text-main-unselected-text hover:bg-main-unselected-hover hover:text-main-text-hover transition-all duration-300"
    >
      <div>{{ label }}</div>
      <XCircleIcon
        class="size-4 cursor-pointer hover:scale-110 transition-transform duration-200"
        @click="onRemove"
      />
    </div>
  </div>
</template>
