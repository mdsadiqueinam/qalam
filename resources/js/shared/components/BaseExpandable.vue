<script setup>
import { TransitionRoot } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

// --- Props & models ---
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 300,
  },
})

// --- Emits ---
const emit = defineEmits(['update:modelValue'])

// --- Vars ---
const contentRef = ref(null)

// --- Handlers ---
function captureHeight() {
  if (contentRef.value?.$el) {
    contentRef.value.$el.style.height = `${contentRef.value.$el.scrollHeight}px`
  }
}

function clearHeight() {
  if (contentRef.value?.$el) {
    contentRef.value.$el.style.height = ''
  }
}

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

// --- Watchers & computed ---
const isExpanded = computed(() => props.modelValue)

const enterDuration = computed(() => `duration-${props.duration}`)
const leaveDuration = computed(() => `duration-${Math.round(props.duration * 0.67)}`)
</script>

<template>
  <div class="overflow-hidden">
    <!-- Header / Trigger -->
    <div
      class="cursor-pointer"
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
      @click="toggle"
    >
      <slot name="header" :isExpanded="isExpanded" :toggle="toggle">
        <div class="flex w-full items-center justify-between px-4 py-3">
          <slot name="title" :isExpanded="isExpanded" />
          <ChevronDownIcon
            class="size-5 text-main-text-muted transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded }"
          />
        </div>
      </slot>
    </div>

    <!-- Expandable Content -->
    <TransitionRoot
      ref="contentRef"
      :show="isExpanded"
      :enter="`transition-[height] ${enterDuration} ease-out overflow-hidden`"
      enterFrom="!h-0"
      :leave="`transition-[height] ${leaveDuration} ease-in overflow-hidden`"
      leaveTo="!h-0"
      @beforeEnter="captureHeight"
      @afterEnter="clearHeight"
      @beforeLeave="captureHeight"
      @afterLeave="clearHeight"
    >
      <div>
        <slot :isExpanded="isExpanded" />
      </div>
    </TransitionRoot>
  </div>
</template>
