<script setup>
import { computed, ref, onMounted, useSlots } from "vue";
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
    type: String,
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
  variant: {
    type: String,
    default: "primary",
    validator(value) {
      return ["primary", "secondary", "text", "outline"].includes(value);
    },
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

function onInput(e) {
  emit("update:modelValue", e.target.value);
}

// --- Watchers & computed ---
const showClearBtn = computed(() => {
  return props.clearBtn && Boolean(props.modelValue);
});

const sizeClasses = computed(() => {
  return props.size === "sm" ? "h-8 text-sm" : "h-10 text-sm";
});

const variantWrapperClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-sidebar border border-divider focus-within:border-divider-hover";
    case "text":
      return "bg-transparent border border-transparent focus-within:border-divider";
    case "outline":
      return "bg-transparent border border-border-default focus-within:border-primary";
    case "primary":
    default:
      return "bg-primary/5 border border-primary/10 focus-within:border-primary";
  }
});

const variantIconClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "text-sidebar-text";
    case "text":
    case "outline":
      return "text-main-text-muted";
    case "primary":
    default:
      return "text-primary/60";
  }
});

const variantPlaceholderClass = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "placeholder:text-main-text-muted";
    case "text":
    case "outline":
      return "placeholder:text-main-text-muted";
    case "primary":
    default:
      return "placeholder:text-primary/40";
  }
});

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
  <div class="flex w-full flex-col gap-1">
    <!-- Label -->
    <label
      v-if="label"
      :for="name"
      class="text-sm font-medium text-main-text"
      :class="[labelWrapperClass, { 'opacity-50': disabled }]"
    >
      {{ label }}
      <span v-if="required" class="text-bad ms-0.5">*</span>
    </label>

    <!-- Input wrapper -->
    <div
      class="flex w-full flex-1 items-stretch rounded-lg transition-all"
      :class="[
        sizeClasses,
        variantWrapperClasses,
        { 'opacity-50 cursor-not-allowed': disabled },
      ]"
    >
      <!-- Leading icon slot -->
      <div
        v-if="$slots.icon"
        class="flex items-center justify-center pl-3"
        :class="variantIconClasses"
      >
        <slot name="icon" />
      </div>

      <!-- Input element -->
      <input
        ref="inputEl"
        :id="name"
        :name="name"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :step="step"
        :min="min"
        :max="max"
        :pattern="pattern"
        class="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full px-3 text-main-text"
        :class="[variantPlaceholderClass, inputClass]"
        @input="onInput"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />

      <!-- Clear button -->
      <div v-if="showClearBtn" class="flex items-center pr-2">
        <BaseButton variant="transparent" icon-only size="sm" @click="clear">
          <template #icon>
            <XMarkIcon class="w-3.5 h-3.5 text-main-text-muted" />
          </template>
        </BaseButton>
      </div>

      <!-- Trailing slot -->
      <div v-if="$slots.append" class="flex items-center pr-2">
        <slot name="append" />
      </div>
    </div>

    <!-- Error message -->
    <p v-if="errorMsg" class="text-xs text-bad mt-0.5">{{ errorMsg }}</p>
  </div>
</template>
