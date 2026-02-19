<script setup>
import { ref, nextTick, watch } from 'vue'
import { ComboboxOption } from '@headlessui/vue'

// --- Props ---
const props = defineProps({
  value: {
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

// --- Vars ---
const textRef = useTemplateRef('textRef')
const isTextTruncated = ref(false)

// --- Methods ---
function checkIfTextIsTruncated() {
  if (textRef.value) {
    isTextTruncated.value = textRef.value.scrollWidth > textRef.value.clientWidth
  }
}

// --- Watchers ---
watch(
  () => props.label,
  () => {
    nextTick(checkIfTextIsTruncated)
  },
  { immediate: true },
)

// --- Lifecycle ---
</script>

<template>
  <ComboboxOption
    :value="value"
    as="template"
    v-slot="{ active, selected }"
    class="flex min-h-8 w-full max-w-full items-center text-sm text-sidebar-text focus:outline-none"
  >
    <li
      class="group mx-1 flex h-full cursor-pointer items-center gap-3 rounded-lg px-2 text-main-text hover:bg-sidebar-selected hover:text-main-text-hover transition-colors duration-200"
      :class="{
        'bg-sidebar-selected text-main-text-hover': active,
        '': !active,
      }"
    >
      <slot name="indicator" :selected="selected" />
      <span ref="textRef" class="truncate">{{ label }}</span>
      <BaseTooltip v-if="isTextTruncated" :content="label" target />
    </li>
  </ComboboxOption>
</template>
