<script setup>
// --- Props & models
defineProps({
  arabicChar: {
    type: String,
    default: "",
  },
  englishKey: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "normal", // normal, special, active
  },
  width: {
    type: String,
    default: "w-12",
  },
});

const emit = defineEmits(["key-press"]);

// --- Handlers
function handleClick() {
  emit("key-press");
}
</script>

<template>
  <div
    class="keyboard-key group relative flex h-14 cursor-pointer flex-col items-center justify-center rounded-lg border transition-all"
    :class="[
      width,
      variant === 'special'
        ? 'border-divider bg-main-unselected text-main-text-muted hover:bg-main-unselected-hover'
        : variant === 'active'
          ? 'border-primary bg-primary/5'
          : 'border-border-default bg-sidebar hover:bg-primary/5 hover:border-primary/30',
    ]"
    @click="handleClick"
  >
    <!-- Arabic character (for normal keys) -->
    <span
      v-if="arabicChar && variant === 'normal'"
      class="font-serif text-lg font-bold"
      :class="variant === 'active' ? 'text-primary' : 'text-main-text'"
    >
      {{ arabicChar }}
    </span>

    <!-- Label (for special keys) -->
    <span
      v-if="label"
      class="font-bold"
      :class="label.length > 4 ? 'text-[10px]' : 'text-xs'"
    >
      {{ label }}
    </span>

    <!-- English key hint (top-left corner) -->
    <span
      v-if="englishKey && variant === 'normal'"
      class="absolute top-1 left-1.5 text-[10px] transition-colors"
      :class="
        variant === 'active'
          ? 'text-primary/70'
          : 'text-main-text-muted group-hover:text-primary/70'
      "
    >
      {{ englishKey }}
    </span>
  </div>
</template>

<style scoped>
.keyboard-key {
  box-shadow: 0 2px 0 0 rgb(209 213 219);
}

.keyboard-key:active {
  transform: translateY(2px);
  box-shadow: 0 0 0 0 rgb(209 213 219);
}

.dark .keyboard-key {
  box-shadow: 0 2px 0 0 rgb(71 85 105);
}

.dark .keyboard-key:active {
  box-shadow: 0 0 0 0 rgb(71 85 105);
}
</style>
