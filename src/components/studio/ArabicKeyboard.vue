<script setup>
import { ref, computed } from "vue";
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
} from "@utils/keyboard";
import { ARABIC_LAYOUTS } from "@root/constants/keyboard";
import { useEventListener } from "@vueuse/core";

// --- Props & models
const emit = defineEmits(["keyPress"]);

// --- Vars (ref, reactive)
const keyboardLayout = ref([]); // Array<Array<{ code, type, englishKey?, arabicKey?, label?, width? }>>
const layoutSupported = ref(true);
const layoutName = ref("QWERTY");
const pressedKeys = ref(new Set());
const selectedLayoutId = useLocalStorage("qalam-keyboard-layout", "standard");
const shiftState = computed(
  () =>
    pressedKeys.value.has("ShiftLeft") || pressedKeys.value.has("ShiftRight"),
);
const altState = computed(
  () => pressedKeys.value.has("AltLeft") || pressedKeys.value.has("AltRight"),
);
const selectedLayout = computed(
  () =>
    ARABIC_LAYOUTS.find((l) => l.id === selectedLayoutId.value) ??
    ARABIC_LAYOUTS[0],
);

const IGNORED_KEYS = [
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
];

// --- Handlers
/**
 *
 * @param event {KeyboardEvent}
 * @param mapping {{  }}
 */
function handleKeyPress(event, mapping) {
  if (IGNORED_KEYS.some((key) => pressedKeys.value.has(key))) return;

  event.preventDefault();
  event.stopPropagation();
  emit("keyPress", shiftState.value ? mapping.shift : mapping.default);
}

async function detectKeyboardLayout() {
  const result = await detectLayout();

  layoutSupported.value = result.supported;
  keyboardLayout.value = result.layout;

  if (result.supported && result.layoutMap) {
    const detectedName = getLayoutType(result.layoutMap);
    layoutName.value = addRegionalInfo(detectedName);
  }
}

// --- Computed
const rowClasses = computed(() => [
  "ml-0", // Row 0: Numbers
  "ml-6", // Row 1: QWERTY
  "ml-8", // Row 2: ASDF
  "ml-12", // Row 3: ZXCV
  "ml-0", // Row 4: Bottom
]);

// --- Lifecycle
function onKeyDown(e) {
  if (IGNORED_KEYS.some((key) => pressedKeys.value.has(key))) {
    return;
  }

  pressedKeys.value = new Set([...pressedKeys.value, e.code]);
  const mapping = selectedLayout.value.map[e.code];
  if (mapping) {
    handleKeyPress(e, mapping);
  }
}

function onKeyUp(e) {
  const next = new Set(pressedKeys.value);
  next.delete(e.code);
  pressedKeys.value = next;
}

function getEnglishKey(key) {
  if (key.type === "char") {
    return key.englishKey;
  }
  return { default: key.label, shift: key.label };
}

function getArabicKey(key) {
  if (key.type !== "char") return {};
  const entry = selectedLayout.value.map[key.code];
  return entry ?? {};
}

function getVariant(key) {
  if (pressedKeys.value.has(key.code)) {
    return "active";
  }
  if (key.type === "special") {
    return "special";
  }
  return "default";
}

useEventListener("keydown", onKeyDown);
useEventListener("keyup", onKeyUp);

detectKeyboardLayout();
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
        <!-- Layout selector pills -->
        <div class="flex items-center gap-1.5">
          <button
            v-for="layout in ARABIC_LAYOUTS"
            :key="layout.id"
            class="rounded-full px-3 py-0.5 text-[11px] font-semibold transition-colors"
            :class="
              selectedLayoutId === layout.id
                ? 'bg-primary text-white'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            "
            @click="selectedLayoutId = layout.id"
          >
            {{ layout.label }}
          </button>
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
        <div
          v-for="(row, rowIndex) in keyboardLayout"
          :key="rowIndex"
          class="flex justify-center gap-1.5"
          :class="rowClasses[rowIndex]"
        >
          <KeyButton
            v-for="key in row"
            :key="key.code"
            :englishKey="getEnglishKey(key)"
            :arabicKey="getArabicKey(key)"
            :shift="shiftState"
            :alt="altState"
            :variant="getVariant(key)"
            :width="key.width"
          />

          <!-- Arrow keys (appended to bottom row) -->
          <template v-if="rowIndex === keyboardLayout.length - 1">
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
          </template>
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
