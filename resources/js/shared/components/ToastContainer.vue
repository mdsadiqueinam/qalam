<script setup>
import { useToast } from '@shared/use/useToast'

// --- Use ---
const toasts = useToast()

// --- Props & models ---
// None

// --- Emits ---
// None

// --- Vars ---
// None

// --- Handlers ---
const addToast = (newToast) => {
  toasts.add(newToast)
}

// --- Watchers & computed ---
// None

// --- Lifecycle hooks & related ---
// None
</script>

<template>
  <div
    v-if="toasts.list.value.length"
    class="absolute bottom-0 right-0 z-51 flex min-h-[40px] w-96 flex-col overflow-hidden p-4 pointer-events-none"
  >
    <TransitionGroup
      class="scale relative h-full w-full space-y-3"
      tag="div"
      enter-active-class="relative duration-300 transition-all ease-out"
      leave-active-class="absolute origin-center duration-300 transition-all ease-in"
      enter-from-class="translate-x-full opacity-0 scale-95"
      leave-to-class="translate-x-full opacity-0 scale-95"
      move-class="duration-300 transition-all ease-out"
    >
      <ToastPopup
        v-for="toast in toasts.list.value"
        :key="toast.id"
        :toast="toast"
        @delete="toasts.remove"
      />
    </TransitionGroup>
  </div>
</template>
