<script setup>
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

// --- Use ---
// None

// --- Props & models ---
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  labelLeft: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
  },
  bgColorClass: {
    type: Object,
    default: { 'bg-green': true },
  },
  thumbColorClass: {
    type: Object,
    default: { 'bg-main': true },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  labelOpacity: {
    type: Number,
    default: 1,
  },
  tooltip: {
    type: String,
    default: null,
  },
})
const modelValue = defineModel()

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
  <BaseTooltip :disabled="!tooltip || disabled">
    <SwitchGroup>
      <div class="flex items-center">
        <SwitchLabel
          v-if="props.label && props.labelLeft"
          class="text-12 mb-2 mr-2 inline-block"
          :class="{ 'text-xs': size === 'sm' }"
          :style="{ opacity: labelOpacity }"
        >
          {{ props.label }}
        </SwitchLabel>
        <Switch
          :disabled="props.disabled"
          :id="props.id"
          :name="props.name"
          :model-value="modelValue"
          class="relative inline-flex shrink-0 cursor-pointer rounded-full border border-divider transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-good/20 focus:ring-offset-2"
          :class="{
            'bg-primary': modelValue,
            'bg-primary/40': !modelValue,
            'h-4 w-7 p-0.5': size === 'sm',
            'h-6 w-11 p-[3px]': size === 'md',
            ...bgColorClass,
            'cursor-not-allowed! opacity-50': props.disabled,
          }"
          @update:modelValue="$emit('update:modelValue', $event)"
        >
          <span
            aria-hidden="true"
            :class="{
              'translate-x-full': modelValue,
              'translate-x-0': !modelValue,
              ...thumbColorClass,
            }"
            class="toggle-switch-thumb pointer-events-none inline-block h-full w-1/2 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
          />
        </Switch>
        <SwitchLabel
          v-if="props.label && !props.labelLeft"
          class="text-12 ml-2 inline-block"
          :class="{ 'text-xs': size === 'sm' }"
          :style="{ opacity: labelOpacity }"
        >
          {{ label }}
        </SwitchLabel>
      </div>
    </SwitchGroup>
    <template #content>{{ tooltip }}</template>
  </BaseTooltip>
</template>
