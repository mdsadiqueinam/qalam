<script setup>
import { ref, onMounted } from "vue";
import {
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/vue/24/outline";
import KeyButton from "@components/studio/KeyButton.vue";
import { KEYBOARD_ROWS, FALLBACK_QWERTY_KEYS } from "@root/constants/keyboard";

// --- Props & models
defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["keyPress", "toggle"]);

// --- Vars (ref, reactive)
const keyboardLayout = ref([]);
const layoutSupported = ref(true);
const layoutName = ref("QWERTY"); // Detected layout name

// --- Handlers
function handleKeyPress(char) {
  emit("keyPress", char);
}

function handleToggle() {
  emit("toggle");
}

async function detectKeyboardLayout() {
  // Check if Keyboard API is supported
  if (!("keyboard" in navigator) || !navigator.keyboard.getLayoutMap) {
    console.warn("Keyboard API not supported, using fallback");
    layoutSupported.value = false;
    useFallbackLayout();
    return;
  }

  try {
    const layoutMap = await navigator.keyboard.getLayoutMap();

    // Build keyboard layout from the detected layout
    keyboardLayout.value = KEYBOARD_ROWS.map((row) => {
      return row.map((code) => {
        const key =
          layoutMap.get(code) || code.replace(/^Key/, "").replace(/^Digit/, "");
        return {
          code,
          key: key.toUpperCase(),
          display: key.toUpperCase(),
        };
      });
    });

    // Detect layout type by checking key positions
    detectLayoutType(layoutMap);
  } catch (error) {
    console.error("Error detecting keyboard layout:", error);
    layoutSupported.value = false;
    useFallbackLayout();
  }
}

function detectLayoutType(layoutMap) {
  // Check specific keys to determine layout type
  const keyQ = layoutMap.get("KeyQ");
  const keyW = layoutMap.get("KeyW");
  const keyE = layoutMap.get("KeyE");
  const keyA = layoutMap.get("KeyA");
  const keyS = layoutMap.get("KeyS");
  const keyD = layoutMap.get("KeyD");
  const keyF = layoutMap.get("KeyF");
  const keyY = layoutMap.get("KeyY");
  const keyZ = layoutMap.get("KeyZ");

  // AZERTY (French)
  if (keyA === "q" && keyQ === "a" && keyZ === "w") {
    layoutName.value = "AZERTY";
  }
  // QWERTZ (German)
  else if (keyZ === "y" && keyY === "z") {
    layoutName.value = "QWERTZ";
  }
  // DVORAK
  else if (keyQ === "'" && keyW === "," && keyE === ".") {
    layoutName.value = "DVORAK";
  }
  // Colemak
  else if (keyS === "r" && keyD === "s" && keyF === "t") {
    layoutName.value = "COLEMAK";
  }
  // QWERTY (default)
  else if (keyQ === "q" && keyW === "w") {
    layoutName.value = "QWERTY";
  }
  // Unknown
  else {
    layoutName.value = "UNKNOWN";
  }

  // Try to get locale for more specific info
  const locale = navigator.language || navigator.userLanguage;
  if (locale) {
    const region = locale.split("-")[1]?.toUpperCase();
    if (region && layoutName.value === "QWERTY") {
      layoutName.value = `QWERTY (${region})`;
    }
  }
}

function useFallbackLayout() {
  // Fallback to standard QWERTY layout
  keyboardLayout.value = FALLBACK_QWERTY_KEYS.map((row, rowIndex) => {
    return row.map((key, keyIndex) => ({
      code: KEYBOARD_ROWS[rowIndex][keyIndex],
      key,
      display: key,
    }));
  });
}

// --- Lifecycle
onMounted(() => {
  detectKeyboardLayout();
});
</script>

<template>
  <div
    v-if="visible"
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
            @click="handleToggle"
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
          :class="{
            'ml-0': rowIndex === 0,
            'ml-6': rowIndex === 1,
            'ml-8': rowIndex === 2,
            'ml-12': rowIndex === 3,
          }"
        >
          <!-- SHIFT key for row 4 (bottom row) -->
          <KeyButton
            v-if="rowIndex === 3"
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
            v-if="rowIndex === 0"
            label="BKSPC"
            variant="special"
            width="w-20"
            @keyPress="handleKeyPress('BACKSPACE')"
          />
          <KeyButton
            v-if="rowIndex === 2"
            label="ENTER"
            variant="special"
            width="w-24"
            @keyPress="handleKeyPress('\n')"
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
