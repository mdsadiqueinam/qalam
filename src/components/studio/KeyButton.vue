<script setup>
// --- Props & models
defineProps({
  englishKey: {
    type: Object, // { normal: 'a', shift: 'A' }
    default: () => ({}),
  },
  shift: {
    type: Boolean,
    default: false,
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

const emit = defineEmits(["keyPress"]);

// --- Handlers
function handleClick() {
  emit("keyPress");
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
    <!-- Main key display - shows normal or shift variant based on shift prop -->
    <span
      v-if="englishKey?.normal"
      class="font-bold text-base"
      :class="variant === 'active' ? 'text-primary' : 'text-main-text'"
    >
      {{ shift ? englishKey.shift : englishKey.normal }}
    </span>

    <!-- English key hints (small indicators in corners) -->
    <template v-if="englishKey?.normal && variant === 'normal'">
      <!-- Shift variant (top-left corner) -->
      <span
        class="absolute top-1 left-1.5 text-[10px] font-semibold transition-colors"
        :class="
          variant === 'active'
            ? 'text-primary/70'
            : 'text-main-text-muted group-hover:text-primary/70'
        "
      >
        {{ englishKey.shift }}
      </span>

      <!-- Normal variant (bottom-left corner) -->
      <span
        class="absolute bottom-1 left-1.5 text-[10px] transition-colors"
        :class="
          variant === 'active'
            ? 'text-primary/70'
            : 'text-main-text-muted group-hover:text-primary/70'
        "
      >
        {{ englishKey.normal }}
      </span>
    </template>
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
