<script setup>
import { DateTime } from 'luxon'
import { useMutationObserver } from '@vueuse/core'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useDarkMode } from '@root/utils/useDarkMode'

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
  showShortcuts: {
    type: Boolean,
    default: true,
  },
  close: {
    type: Function,
    default: undefined,
  },
})
const selectedDate = defineModel('selectedDate')
const internalSelectedDate = shallowRef(selectedDate.value)
const darkMode = useDarkMode()

let calendarObserver
const calendarContainer = ref(null)

// Function to customize calendar title
function customizeCalendarTitle() {
  const titleButton = document.querySelector('.vc-title')
  if (!titleButton || titleButton.dataset.customized) return

  titleButton.classList.remove('vc-title')
  titleButton.classList.add(
    'flex',
    'items-center',
    'gap-2',
    'shrink-0',
    'h-8',
    'px-2',
    'rounded-lg',
    'border',
    'border-divider',
    'bg-main',
    'cursor-pointer',
    'disabled:cursor-default',
    'hover:bg-main-unselected-hover',
    'hover:border-divider-hover',
    'focus:ring-2',
    'focus:ring-primary/20',
    'focus:ring-offset-2',
    'focus:outline-none',
    'transition-all',
    'duration-300',
  )
  titleButton.style.fontWeight = 'var(--vc-font-semibold)'

  const app = createApp({ render: () => h(ChevronDownIcon, { class: '-mr-1 size-2' }) })
  const vm = app.mount(document.createElement('div'))
  const chartHTML = vm.$el
  app.unmount()

  titleButton.appendChild(chartHTML)
  titleButton.dataset.customized = 'true' // Prevent re-customizing
}

// --- Handlers ---
function clickOnDay(_, event) {
  event.target.blur()
  nextTick(() => {
    if (props.close) props.close()
  })
}

function onClickShortcut(shortcut) {
  let dt = DateTime.fromJSDate(internalSelectedDate.value || new Date())
  const parts = dt.toObject()

  if (shortcut === 'TODAY') dt = DateTime.local()
  if (shortcut === 'ENDOFMONTH') dt = DateTime.local().endOf('month')
  if (shortcut.startsWith('ENDQ')) {
    if (shortcut === 'ENDQ1') dt = DateTime.local().startOf('year').endOf('quarter')
    if (shortcut === 'ENDQ2')
      dt = DateTime.local().startOf('year').plus({ months: 3 }).endOf('quarter')
    if (shortcut === 'ENDQ3')
      dt = DateTime.local().startOf('year').plus({ months: 6 }).endOf('quarter')
    if (shortcut === 'ENDQ4')
      dt = DateTime.local().startOf('year').plus({ months: 9 }).endOf('quarter')
    // If date in the past, set forward now yet
    if (dt.diff(DateTime.local(), 'days').days < 0) {
      dt = dt.plus({ years: 1 })
    }
  }
  // Ensure time is the same as original
  dt = dt.set({
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
    millisecond: parts.millisecond,
  })

  internalSelectedDate.value = dt.toJSDate()
  if (props.close) props.close()
}

// --- Watchers & computed ---
watch(internalSelectedDate, (newDate) => {
  // Convert newDate to a Date object if it's a string
  newDate = typeof newDate === 'string' ? new Date(newDate) : newDate

  // If newDate is invalid, exit the function
  if (!newDate || isNaN(newDate)) {
    return
  }

  // Get the current selected date or default to the current users date
  const currentDateTime = DateTime.fromJSDate(
    selectedDate.value instanceof Date && !isNaN(selectedDate.value)
      ? selectedDate.value
      : new Date(),
  )

  // Set the new date with the same time as the current date
  const newDateTime = DateTime.fromJSDate(newDate).set({
    hour: currentDateTime.hour,
    minute: currentDateTime.minute,
    second: currentDateTime.second,
    millisecond: currentDateTime.millisecond,
  })

  // Update the selectedDate with the new date and time
  selectedDate.value = newDateTime.toJSDate()
})

// Watch for calendar visibility
watch(calendarContainer, (newValue) => {
  if (newValue) {
    const calendar = document.querySelector('.vc-container')
    if (calendar) {
      requestAnimationFrame(customizeCalendarTitle)

      calendarObserver = useMutationObserver(
        calendar,
        (mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              requestAnimationFrame(customizeCalendarTitle)
              break
            }
          }
        },
        {
          childList: true,
          subtree: true,
          characterData: false,
        },
      )
    }
  } else {
    calendarObserver?.stop()
  }
})

const orderedQuarters = computed(() => {
  const currentDate = DateTime.local()
  const currentQuarter = Math.ceil(currentDate.month / 3)

  // Define all quarters
  const quarters = [
    { id: 'ENDQ1', label: 'End Q1' },
    { id: 'ENDQ2', label: 'End Q2' },
    { id: 'ENDQ3', label: 'End Q3' },
    { id: 'ENDQ4', label: 'End Q4' },
  ]

  // Reorder quarters to start with current quarter
  const reordered = []
  for (let i = 0; i < 4; i++) {
    const index = (currentQuarter - 1 + i) % 4
    reordered.push(quarters[index])
  }

  return reordered
})
</script>

<template>
  <div class="flex gap-2" ref="calendarContainer">
    <VDatePicker
      v-model="internalSelectedDate"
      mode="date"
      :minDate="props.minDate"
      :maxDate="props.maxDate"
      :is-dark="darkMode"
      :firstDayOfWeek="firstDayOfWeek"
      borderless
      transparent
      @dayclick="clickOnDay"
    />
    <div v-if="props.showShortcuts" class="flex flex-col pr-2 pt-8">
      <div class="flex flex-col gap-2 pr-2 pt-4">
        <BaseButton variant="outline" size="sm" @click="onClickShortcut('TODAY')">
          {{ t('Today') }}
        </BaseButton>
        <BaseButton variant="outline" size="sm" @click="onClickShortcut('ENDOFMONTH')">
          {{ t('End of month') }}
        </BaseButton>
        <!-- Dynamically ordered quarter buttons -->
        <template v-for="quarter in orderedQuarters" :key="quarter.id">
          <BaseButton variant="outline" size="sm" @click="onClickShortcut(quarter.id)">
            {{ t(quarter.label) }}
          </BaseButton>
        </template>
      </div>
    </div>
  </div>
</template>
