<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  info: {
    type: String,
    default: '',
  },
  headerClass: {
    type: String,
    default: '',
  },
})
</script>
<template>
  <div
    class="mx-2 mt-2 flex shrink-0 flex-col items-stretch justify-start overflow-hidden rounded-xl border border-divider shadow-sm md:mx-4 md:mt-4 lg:mx-8 lg:mt-8"
  >
    <div
      class="border-b group box-border flex h-11 w-full shrink-0 cursor-pointer items-center gap-2 border-divider bg-main-unselected pl-4 pr-4 outline-none transition-colors duration-300"
      :class="headerClass"
    >
      <slot name="header">
        <slot name="beforeTitle" />
        {{ props.name }}
        <slot name="afterTitle" />
      </slot>
    </div>
    <div v-if="props.info" class="px-5 py-3 opacity-80">
      {{ props.info }}
    </div>
    <slot name="contentNoPadding">
      <div class="px-5 py-3">
        <slot />
      </div>
    </slot>
  </div>
</template>
