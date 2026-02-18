<script setup>
import { computed, ref, onMounted, useSlots } from "vue";
import { micromark } from "micromark";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import BaseButton from "./BaseButton.vue";

// --- Use ---
const slots = useSlots();

// --- Props & models ---
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  errorMsg: {
    type: String, // Fixed typo in user request 'errorMsg: String'
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    validator(value) {
      return [
        "text",
        "password",
        "email",
        "datetime-local",
        "date",
        "number",
        "url",
        "checkbox",
      ].includes(value);
    },
    default: "text",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  step: {
    type: [Number, undefined],
    default: undefined,
  },
  min: {
    type: [Number, undefined],
    default: undefined,
  },
  max: {
    type: [Number, undefined],
    default: undefined,
  },
  pattern: {
    type: [String, undefined],
    default: undefined,
  },
  inputClass: {
    type: String,
    default: "",
  },
  labelWrapperClass: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    validator(value) {
      return ["sm", "md"].includes(value);
    },
    default: "md",
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  clearBtn: {
    type: Boolean,
    default: false,
  },
});

// --- Emits ---
const emit = defineEmits(["update:modelValue", "blur", "focus"]);

// --- Vars ---
const inputEl = ref(null);

// --- Handlers ---
function focus() {
  inputEl.value?.focus();
}

function clear() {
  emit("update:modelValue", "");
}

// --- Watchers & computed ---
const showClearBtn = computed(() => {
  return props.clearBtn && Boolean(props.modelValue);
});

const inline = computed(() => props.labelLeft || props.labelRight);

// --- Lifecycle hooks & related ---
onMounted(() => {
  if (props.autofocus) {
    focus();
  }
});

defineExpose({
  inputEl,
  focus,
});
</script>

<template>
  <div
    class="flex w-full flex-1 items-stretch rounded-lg h-full bg-primary/5 border border-primary/10 focus-within:border-primary transition-all"
  >
    <div
      v-if="$slots.icon"
      class="text-primary/60 flex items-center justify-center pl-3"
    >
      <slot name="icon" />
    </div>
    <input
      class="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full placeholder:text-primary/40 px-3 text-sm sans-font"
      placeholder="Search manuscripts..."
      value=""
    />
  </div>
</template>
