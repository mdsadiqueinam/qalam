<script setup>
import { micromark } from 'micromark';

// --- Use ---
const { t } = useI18n();

// --- Props & models ---
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    default: 'true',
  },
  message: {
    type: String,
    default: 'true',
  },
  onSubmit: {
    type: [Function, null],
    default: null,
  },
  onClose: {
    type: [Function, null],
    default: null,
  },
});
const modelValue = defineModel();

// --- Emits ---
const emit = defineEmits(['close']);

// --- Vars ---
// None

// --- Handlers ---
async function close() {
  if (props.onClose) props.onClose();
  emit('close');
  modelValue.value = false;
}

async function submit() {
  if (props.onSubmit) await props.onSubmit();
  close();
}

// --- Watchers & computed ---
// None

// --- Lifecycle hooks & related ---
// None
</script>

<template>
  <BaseDialog :name="name" :show="true" @close="close">
    <div class="flex md:w-[456px] w-full flex-col">
      <div class="mb-8" v-html="micromark(message)" />
      <div class="flex justify-end space-x-2">
        <BaseButton variant="secondary" @click="close">
          {{ t('Cancel') }}
        </BaseButton>
        <BaseButton @click="submit">
          {{ t('Confirm') }}
        </BaseButton>
      </div>
    </div>
  </BaseDialog>
</template>
