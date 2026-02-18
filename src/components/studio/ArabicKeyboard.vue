<script setup>
import {
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/vue/24/outline";
import KeyButton from "@components/studio/KeyButton.vue";

// --- Props & models
defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["keyPress", "toggle"]);

// --- Handlers
function handleKeyPress(char) {
  emit("keyPress", char);
}

function handleToggle() {
  emit("toggle");
}

// Keyboard mapping
const row1 = [
  { arabic: "ض", english: "Q" },
  { arabic: "ص", english: "W" },
  { arabic: "ث", english: "E" },
  { arabic: "ق", english: "R" },
  { arabic: "ف", english: "T" },
  { arabic: "غ", english: "Y" },
  { arabic: "ع", english: "U" },
  { arabic: "ه", english: "I" },
  { arabic: "خ", english: "O" },
  { arabic: "ح", english: "P" },
  { arabic: "ج", english: "[" },
  { arabic: "د", english: "]" },
];

const row2 = [
  { arabic: "ش", english: "A" },
  { arabic: "س", english: "S", active: true },
  { arabic: "ي", english: "D" },
  { arabic: "ب", english: "F" },
  { arabic: "ل", english: "G" },
  { arabic: "ا", english: "H" },
  { arabic: "ت", english: "J" },
  { arabic: "ن", english: "K" },
  { arabic: "م", english: "L" },
  { arabic: "ك", english: ";" },
  { arabic: "ط", english: "'" },
];

const row3 = [
  { arabic: "ئ", english: "Z" },
  { arabic: "ء", english: "X" },
  { arabic: "ؤ", english: "C" },
  { arabic: "ر", english: "V" },
  { arabic: "لا", english: "B" },
  { arabic: "ى", english: "N" },
  { arabic: "ة", english: "M" },
  { arabic: "و", english: "," },
  { arabic: "ز", english: "." },
  { arabic: "ظ", english: "/" },
];
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
            Arabic Transliteration Keyboard
          </span>
          <span
            class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
          >
            ENABLED
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
        <!-- Row 1 -->
        <div class="flex justify-center gap-1.5">
          <KeyButton
            v-for="key in row1"
            :key="key.english"
            :arabicChar="key.arabic"
            :englishKey="key.english"
            :variant="key.active ? 'active' : 'normal'"
            @keyPress="handleKeyPress(key.arabic)"
          />
        </div>

        <!-- Row 2 -->
        <div class="flex justify-center gap-1.5 ml-4">
          <KeyButton
            v-for="key in row2"
            :key="key.english"
            :arabicChar="key.arabic"
            :englishKey="key.english"
            :variant="key.active ? 'active' : 'normal'"
            @keyPress="handleKeyPress(key.arabic)"
          />
          <KeyButton
            label="ENTER"
            variant="special"
            width="w-20"
            @keyPress="handleKeyPress('\n')"
          />
        </div>

        <!-- Row 3 -->
        <div class="flex justify-center gap-1.5">
          <KeyButton
            label="SHIFT"
            variant="special"
            width="w-20"
            @keyPress="handleKeyPress('')"
          />
          <KeyButton
            v-for="key in row3"
            :key="key.english"
            :arabicChar="key.arabic"
            :englishKey="key.english"
            @keyPress="handleKeyPress(key.arabic)"
          />
          <KeyButton
            label="BACKSPACE"
            variant="special"
            width="w-28"
            @keyPress="handleKeyPress('BACKSPACE')"
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
