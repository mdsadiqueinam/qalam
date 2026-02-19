<script setup>
import { RouterLink } from 'vue-router'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

// --- Use ---
const { t } = useI18n()

// --- Props & models ---
const props = defineProps({
  items: Array,
  compact: {
    type: Boolean,
    default: false,
  },
  maxItems: {
    type: Number,
    default: null,
  },
})
const selectedId = defineModel('selectedId')

// --- Emits ---
// None

// --- Vars ---
// None

// --- Handlers ---
// None

// --- Watchers & computed ---
const visibleItems = computed(() => {
  if (!props.maxItems || props.items.length <= props.maxItems) {
    return props.items
  }
  return props.items.slice(0, props.maxItems)
})

const overflowItems = computed(() => {
  if (!props.maxItems || props.items.length <= props.maxItems) {
    return []
  }
  return props.items.slice(props.maxItems)
})

const hasSelectedOverflowItem = computed(() => {
  return overflowItems.value.some((item) => item.id === selectedId.value)
})

// --- Lifecycle hooks & related ---
// None
</script>

<template>
  <div class="flex h-14 shrink-0 select-none flex-nowrap items-center gap-0.5 rounded-lg">
    <!-- Visible tabs -->
    <component
      :is="item.to ? RouterLink : 'button'"
      v-for="(item, i) in visibleItems"
      :key="item.id"
      :to="item.to || item.id"
      class="box-border inline-flex h-14 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 border-t-2 border-t-transparent transition-[border-color] duration-100"
      :class="{
        'px-3': !compact,
        'px-2.5': compact,
        'border-transparent text-main-unselected-text hover:border-b-divider hover:text-main-text-hover':
          item.id !== selectedId,
        'border-b-primary text-main-selected-text': item.id === selectedId,
        'border-r-0': i === 0,
        'border-l-0': i === visibleItems.length - 1,
      }"
      @click.prevent="selectedId = item.id"
    >
      <component
        v-if="item.icon"
        :is="item.icon"
        class="size-4"
        :style="item.iconColor ? 'color:' + item.iconColor : ''"
      />
      {{ item.name }}
      <span
        v-if="item.badge"
        class="-mr-1 inline-flex shrink-0 cursor-pointer flex-row items-center gap-1 overflow-hidden rounded-lg border border-solid border-divider bg-sidebar px-1 py-0.5 text-[0.6rem] sm:px-2 sm:text-tiny"
      >
        {{ item.badge }}
      </span>
    </component>

    <!-- Overflow dropdown -->
    <BasePopover v-if="overflowItems.length > 0" placement="bottom-start">
      <!-- Button -->
      <template #button>
        <button
          class="box-border inline-flex h-14 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 border-l-0 border-t-2 border-t-transparent px-3 text-sm transition-[border-color] duration-100"
          :class="{
            'border-transparent text-main-unselected-text hover:border-b-divider hover:text-main-text-hover':
              !hasSelectedOverflowItem,
            'border-b-primary text-main-selected-text': hasSelectedOverflowItem,
          }"
        >
          {{ t('More') }}
          <ChevronDownIcon class="size-4" />
        </button>
      </template>
      <!-- Content -->
      <template #content="{ open, close }">
        <dropPickerPanel
          v-if="open"
          v-model:selectedItemId="selectedId"
          :items="overflowItems"
          :closeOnSelect="true"
          :showSearch="false"
          :widthClass="'w-48'"
          @close="close"
        >
          <template #text="{ item }">
            {{ item.name }}
          </template>
          <template #icon="{ item }">
            <component
              v-if="item.icon"
              :is="item.icon"
              class="size-4"
              :style="item.iconColor ? 'color:' + item.iconColor : ''"
            />
          </template>
        </dropPickerPanel>
      </template>
    </BasePopover>
  </div>
</template>
