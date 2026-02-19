<script setup>
import { DateTime } from 'luxon'

const selectedDate = defineModel({
  type: Date,
  required: true,
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
  <div class="flex flex-nowrap gap-3">
    <div class="max-w-fit">
      <slot name="date-label" />
      <BaseDatePicker v-model:selectedDate="selectedDate" :minDate="new Date()" />
    </div>
    <div>
      <slot name="time-label" />
      <BaseTimePicker v-model:timeInMins="timeInMins" />
    </div>
  </div>
</template>
