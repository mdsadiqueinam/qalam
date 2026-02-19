<script setup>
import { DateTime } from 'luxon'

defineProps({
  minDate: {
    type: [Object, undefined],
    default: undefined,
  },
})

const emit = defineEmits(['close'])

const { t } = useI18n()

const selectedDate = defineModel({
  type: [Date, null],
  default: () => new Date(),
})

const timeInMins = computed({
  get() {
    const d = DateTime.fromJSDate(selectedDate.value || new Date()).toLocal()
    return d.hour * 60 + d.minute
  },
  set(newTimeInMins) {
    let d = DateTime.fromJSDate(selectedDate.value || new Date()).toLocal()
    const hours = Math.floor(newTimeInMins / 60)
    const mins = newTimeInMins % 60
    d = d.set({ hour: hours, minute: mins, second: 0, millisecond: 0 })
    selectedDate.value = d.toJSDate()
  },
})
</script>

<template>
  <BasePopover placement="bottom-end">
    <template #button="{ open }">
      <slot name="button" :open="open" />
    </template>
    <template #content="{ open, close }">
      <div v-if="open" class="p-4 bg-sidebar rounded-xl border border-divider shadow-lg">
        <div class="flex flex-col gap-3">
          <BaseDatePickerDropMenuPanel v-model:selectedDate="selectedDate" :minDate="minDate" />
          <div class="flex border-t border-divider pt-3 justify-between">
            <BaseTimePicker v-model:timeInMins="timeInMins" />
            <BaseButton
              variant="filter"
              @click="
                () => {
                  close()
                  emit('close')
                }
              "
            >
              {{ t('Close') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
  </BasePopover>
</template>
