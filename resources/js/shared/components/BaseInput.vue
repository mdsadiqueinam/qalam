<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div
    class="flex w-full items-center rounded-lg bg-primary/5 border border-primary/10 focus-within:border-primary transition-all px-2 gap-2 h-full"
  >
    <slot name="icon" />
    <input
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      :type="type"
      :placeholder="placeholder"
      class="flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-sm text-sidebar-text placeholder:text-primary/40 font-sans"
    />
  </div>
</template>
