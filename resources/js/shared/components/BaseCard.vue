<script setup>
// --- Props ---
defineProps({
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  tooltip: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-xl bg-main/20 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-main-unselected/50 dark:ring-white/10"
  >
    <div v-if="title" class="text-xs font-medium uppercase tracking-wide opacity-60">
      {{ title }}

      <BaseTooltip v-if="tooltip">
        <component v-if="icon" :is="icon" class="-mt-0.5 inline size-3 opacity-70" />
        <template #content>
          {{ tooltip }}
        </template>
      </BaseTooltip>
    </div>

    <div class="flex flex-col gap-2">
      <slot />
    </div>
  </div>
</template>
