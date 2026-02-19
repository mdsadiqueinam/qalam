<script setup>
  // --- Use ---
  // None

  // --- Props & models ---
  defineOptions({
    inheritAttrs: false,
  });

  defineProps({
    name: {
      type: String,
      default: 'default',
    },
  });

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
</script>

<template>
  <slot :name="name" />
</template>
