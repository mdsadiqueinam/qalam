<template>
  <nav class="group relative">
    <button
      class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-main-text transition-colors duration-200 hover:bg-sidebar-selected hover:text-main-text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
    >
      {{ title }}
      <ChevronRightIcon class="size-4 transition-transform duration-300 group-hover:rotate-90" />
    </button>

    <!-- Dropdown Menu Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <div class="absolute right-0 top-full z-50 hidden pt-2 group-hover:block">
        <div
          class="min-w-[240px] rounded-xl border border-divider-hover bg-main-unselected shadow-xl ring-1 ring-black/5 backdrop-blur-sm"
        >
          <ul class="flex flex-col gap-1 overflow-visible py-1 text-nav">
            <li v-for="option in options" :key="option.path">
              <RouterLink
                :to="option.path"
                class="group/menuItem mx-1 flex h-8 shrink-0 cursor-pointer items-center gap-3 overflow-hidden text-ellipsis text-nowrap rounded-lg px-2 text-main-text transition-colors duration-200 hover:bg-sidebar-selected hover:text-main-text-hover"
              >
                {{ option.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
})
</script>
