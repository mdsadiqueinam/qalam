<script setup>
import { ref, computed, onMounted } from "vue";
import {
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/vue/24/outline";
import KeyButton from "@components/studio/KeyButton.vue";
import {
  detectKeyboardLayout as detectLayout,
  detectLayoutType as getLayoutType,
  addRegionalInfo,
  generateFallbackLayout,
} from "@utils/keyboard";

// --- Props & models
const emit = defineEmits(["keyPress"]);

// --- Vars (ref, reactive)
const keyboardLayout = ref([]);
const layoutSupported = ref(true);
const layoutName = ref("QWERTY"); // Detected layout name

// --- Handlers
function handleKeyPress(char) {
  emit("keyPress", char);
}

async function detectKeyboardLayout() {
  const result = await detectLayout();

  layoutSupported.value = result.supported;

  if (result.supported && result.layout) {
    keyboardLayout.value = result.layout;
    const detectedName = getLayoutType(result.layoutMap);
    layoutName.value = addRegionalInfo(detectedName);
  } else {
    keyboardLayout.value = generateFallbackLayout();
    layoutName.value = "QWERTY";
  }
}

// --- Computed
const rowClasses = computed(() => [
  "ml-0", // Row 0: Numbers
  "ml-6", // Row 1: QWERTY
  "ml-8", // Row 2: ASDF
  "ml-12", // Row 3: ZXCV
]);

const hasLeftShift = computed(() => (rowIndex) => rowIndex === 3);
const hasRightShift = computed(() => (rowIndex) => rowIndex === 3);
const hasBackspace = computed(() => (rowIndex) => rowIndex === 0);
const hasEnter = computed(() => (rowIndex) => rowIndex === 2);

// --- Lifecycle
onMounted(() => {
  detectKeyboardLayout();
});
</script>

<template>
  <div
    class="bg-sidebar border-t border-divider p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
  >
    <div class="mx-auto max-w-5xl">
      <!-- Keyboard Header -->
      <div class="flex items-center justify-between mb-3 px-2">
        <div class="flex items-center gap-3">
          <span
            class="text-xs font-bold text-main-text-muted uppercase tracking-wider"
          >
            Your {{ layoutName }} Keyboard
          </span>
          <span
            class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
          >
            {{ layoutSupported ? "DETECTED" : "FALLBACK" }}
          </span>
        </div>
        <div class="flex gap-2">
          <button
            class="flex items-center gap-1 text-xs font-medium text-main-text-muted hover:text-primary transition-colors"
          >
            <ChevronDownIcon class="w-4 h-4" />
            Hide
          </button>
        </div>
      </div>

      <!-- Keyboard Layout -->
      <div class="grid gap-1.5 select-none">
        <!-- Dynamic Rows: Numbers, QWERTY, ASDF, ZXCV -->
        <div
          v-for="(row, rowIndex) in keyboardLayout"
          :key="rowIndex"
          class="flex justify-center gap-1.5"
          :class="rowClasses[rowIndex]"
        >
          <!-- Left SHIFT key for row 3 (ZXCV row) -->
          <KeyButton
            v-if="hasLeftShift(rowIndex)"
            label="SHIFT"
            variant="special"
            width="w-20"
            @keyPress="handleKeyPress('')"
          />

          <!-- Regular keys from detected layout -->
          <KeyButton
            v-for="key in row"
            :key="key.code"
            :label="key.display"
            variant="normal"
            @keyPress="handleKeyPress(key.key)"
          />

          <!-- Row-specific special keys -->
          <KeyButton
            v-if="hasBackspace(rowIndex)"
            label="BKSPC"
            variant="special"
            width="w-20"
            @keyPress="handleKeyPress('BACKSPACE')"
          />
          <KeyButton
            v-if="hasEnter(rowIndex)"
            label="ENTER"
            variant="special"
            width="w-24"
            @keyPress="handleKeyPress('\n')"
          />
          <KeyButton
            v-if="hasRightShift(rowIndex)"
            label="SHIFT"
            variant="special"
            width="w-20"
            @keyPress="handleKeyPress('')"
          />
        </div>

        <!-- Row 4 -->
        <div class="flex justify-center gap-1.5">
          <KeyButton
            label="CTRL"
            variant="special"
            width="w-20"
            @keyPress="handleKeyPress('')"
          />
          <KeyButton
            label="ALT"
            variant="special"
            width="w-20"
            @keyPress="handleKeyPress('')"
          />
          <KeyButton
            label="SPACE"
            variant="special"
            width="w-96"
            @keyPress="handleKeyPress(' ')"
          />
          <KeyButton
            label="ALT GR"
            variant="special"
            width="w-20"
            @keyPress="handleKeyPress('')"
          />

          <!-- Arrow keys -->
          <div class="flex gap-1">
            <div class="flex items-center">
              <button
                class="keyboard-key flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-divider bg-main-unselected text-main-text-muted transition-all"
                @click="handleKeyPress('ARROW_LEFT')"
              >
                <ArrowLeftIcon class="w-4 h-4" />
              </button>
            </div>
            <div class="flex flex-col gap-1">
              <button
                class="keyboard-key flex h-5.5 w-12 cursor-pointer items-center justify-center rounded-lg border border-divider bg-main-unselected text-main-text-muted transition-all"
                @click="handleKeyPress('ARROW_UP')"
              >
                <ArrowUpIcon class="w-3 h-3" />
              </button>
              <button
                class="keyboard-key flex h-5.5 w-12 cursor-pointer items-center justify-center rounded-lg border border-divider bg-main-unselected text-main-text-muted transition-all"
                @click="handleKeyPress('ARROW_DOWN')"
              >
                <ArrowDownIcon class="w-3 h-3" />
              </button>
            </div>
            <div class="flex items-center">
              <button
                class="keyboard-key flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-divider bg-main-unselected text-main-text-muted transition-all"
                @click="handleKeyPress('ARROW_RIGHT')"
              >
                <ArrowRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
