<script setup>
// --- Props & models
defineProps({
  englishKey: {
    type: Object, // { default: 'q', shift: 'Q' }
    default: () => ({}),
  },
  arabicKey: {
    type: Object, // { default: 'ض', shift: 'ض' }
    default: () => ({}),
  },
  shift: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "default", // default, special, active
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
    <!-- Normal key: Arabic center + English top-left -->
    <template v-if="variant === 'default'">
      <!-- Arabic character (center) -->
      <span
        class="font-serif text-lg font-bold"
        :class="variant === 'active' ? 'text-primary' : 'text-main-text'"
      >
        {{ shift ? arabicKey.shift || arabicKey.default : arabicKey.default }}
      </span>

      <!-- English key hint (top-left) -->
      <span
        class="absolute top-1 left-1.5 text-[10px] transition-colors text-main-text-muted group-hover:text-primary/70"
      >
        {{ shift ? englishKey.shift : englishKey.default }}
      </span>
    </template>

    <!-- Special key: just show the label centered -->
    <template v-else>
      <span
        class="font-bold"
        :class="[englishKey.default?.length > 4 ? 'text-[10px]' : 'text-xs']"
      >
        {{ englishKey.default }}
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
