<script setup>
import { DateTime } from 'luxon'
import { CalendarIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '@utils/dateTime.js'

// --- Use ---
const { t } = useI18n()

// --- Props & models ---
const props = defineProps({
  firstDayOfWeek: {
    type: Number,
    default: 2, // 1 = Sunday, 2 = Monday
  },
  minDate: {
    type: [Object, undefined],
    default: undefined,
  },
  maxDate: {
    type: [Object, undefined],
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showShortcuts: {
    type: Boolean,
    default: true,
  },
  // Important to set this to false for dates where we don't need time, store is UTC like "dueDate" (date concepts)
  useUserTimeZone: {
    type: Boolean,
    default: true,
  },
  is: {
    type: [String, null],
    default: 'button',
  },
})

/**
 * The selected date. Can be null.
 * @type {import('vue').ModelRef<Date>}
 */
const selectedDate = defineModel('selectedDate', {
  type: Object,
})

const internalSelectedDate = computed({
  get() {
    return selectedDate.value
  },
  set(newDate) {
    // Convert newDate to a Date object if it's a string
    newDate = typeof newDate === 'string' ? new Date(newDate) : newDate
    // or DateTime instance
    // newDate = newDate instanceof DateTime ? newDate.toJSDate() : newDate;

    // If newDate is invalid, exit the function
    if (isNaN(newDate)) {
      return
    }

    // If we should use the user time zone, then just set selectedDate to the new date value from
    // the drop picker, as that has the users time already set on it
    if (props.useUserTimeZone) {
      selectedDate.value = newDate
    } else {
      // Otherwise, we need to convert to UTC and drop the time
      selectedDate.value = DateTime.fromJSDate(newDate).toUTC().startOf('day').toJSDate()
    }
  },
})

// --- Emits ---
// None

// --- Vars ---

// --- Handlers ---
// None

// --- Lifecycle hooks & related ---
// None
</script>

<template>
  <BaseDatePickerDropMenu
    v-model:selectedDate="internalSelectedDate"
    :minDate="props.minDate"
    :maxDate="props.maxDate"
    :showShortcuts="props.showShortcuts"
    :firstDayOfWeek="firstDayOfWeek"
    :useUserTimeZone="props.useUserTimeZone"
  >
    <template #button="{ open }">
      <component
        :disabled="disabled"
        :is="props.is ? props.is : 'span'"
        tabIndex="0"
        :iconOnly="true"
        size="sm"
        class="datepicker flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-divider bg-main px-2 disabled:cursor-default focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:outline-none transition-[border,background-color,color,box-shadow] duration-300"
        :class="{
          'hover:border-divider-hover hover:bg-main-unselected-hover hover:text-main-text-hover':
            !open && !disabled,
          'border-primary bg-main-unselected-hover text-main-text-hover ring-2 ring-primary/20':
            open,
        }"
      >
        <CalendarIcon class="size-4" />

        <span class="whitespace-nowrap text-sm">
          {{
            (props.useUserTimeZone ? internalSelectedDate : selectedDate)
              ? formatDate(
                  props.useUserTimeZone ? internalSelectedDate : selectedDate,
                  'mini',
                  props.useUserTimeZone,
                )
              : t('Select date')
          }}
        </span>

        <ChevronDownIcon class="-mr-1 size-2" />
      </component>
    </template>
  </BaseDatePickerDropMenu>
</template>

<style scoped>
::-webkit-calendar-picker-indicator {
  display: none;
}
</style>
