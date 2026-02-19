<script setup>
import { ClockIcon } from '@heroicons/vue/24/outline'

// --- Use ---
const { t } = useI18n()

// --- Props & models ---

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
const timeInMins = defineModel('timeInMins')

// --- Emits ---
// None

// --- Vars ---
// None

// --- Handlers ---
// None

// --- Watchers & computed ---
const hours24 = computed({
  get() {
    const v = Number(timeInMins.value)
    return Math.floor(v / 60) % 24
  },
  set(newValue) {
    const v = Number(newValue)
    timeInMins.value = (timeInMins.value % 60) + v * 60
  },
})

const hours12 = computed({
  get() {
    const v = Math.floor(Number(timeInMins.value) / 60) % 12
    return v === 0 ? 12 : v
  },
  set(newValue) {
    let v = Number(newValue)
    if (amOrPm.value === 'pm') v += 12
    timeInMins.value = (timeInMins.value % 60) + v * 60
  },
})

const mins = computed({
  get() {
    return Math.round((Number(timeInMins.value) % 60) / 5) * 5
  },
  set(newValue) {
    const v = Number(newValue) % 60
    timeInMins.value = v + hours24.value * 60
  },
})

const amOrPm = computed({
  get() {
    return hours24.value < 12 ? 'am' : 'pm'
  },
  set(newValue) {
    if (newValue === 'am') hours24.value = hours24.value % 12
    else hours24.value = (hours24.value % 12) + 12
  },
})
</script>

<template>
  <div
    class="timepicker flex h-8 items-center overflow-hidden text-nowrap rounded-xl border border-divider bg-transparent text-sm text-main-text transition-[border,background-color,color,opacity] duration-300 hover:text-main-text-hover focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
  >
    <ClockIcon class="ml-2 size-4" />
    <select
      v-model="hours12"
      :disabled="props.disabled"
      class="h-full cursor-pointer bg-transparent! px-1 text-center text-sm font-medium text-main-text outline-none focus:ring-0! focus:ring-offset-0! border-0! disabled:cursor-not-allowed"
    >
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12">12</option>
    </select>
    <span class="text-main-text-muted">:</span>
    <select
      v-model="mins"
      :disabled="props.disabled"
      class="h-full cursor-pointer bg-transparent! px-1 text-center text-sm font-medium text-main-text outline-none focus:ring-0! focus:ring-offset-0! border-0! disabled:cursor-not-allowed"
    >
      <option value="0">00</option>
      <option value="5">05</option>
      <option value="10">10</option>
      <option value="15">15</option>
      <option value="20">20</option>
      <option value="25">25</option>
      <option value="30">30</option>
      <option value="35">35</option>
      <option value="40">40</option>
      <option value="45">45</option>
      <option value="50">50</option>
      <option value="55">55</option>
    </select>
    <select
      v-model="amOrPm"
      :disabled="props.disabled"
      class="h-full cursor-pointer bg-transparent! px-1 text-center text-sm font-medium text-main-text outline-none focus:ring-0! focus:ring-offset-0! border-0! disabled:cursor-not-allowed"
    >
      <option value="am">am</option>
      <option value="pm">pm</option>
    </select>
  </div>
</template>
