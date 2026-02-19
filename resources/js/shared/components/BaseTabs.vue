<script setup>
import { TabGroup, TabList, TabPanels } from '@headlessui/vue'

// --- Use ---
const tabList = ref(null)
const { width: tabListWidth } = useElementSize(tabList)
const { arrivedState } = useScroll(tabList)

// --- Props ---
const props = defineProps({
  defaultIndex: {
    type: Number,
    default: 0,
  },
})

// --- Emits ---
defineEmits(['onTabChange'])

// --- Vars ---
// None

// --- Handlers ---
// None

// --- Watchers & computed ---
const canScroll = computed(() => {
  if (tabList.value === null) {
    return false
  }

  return tabList.value.$el.scrollWidth > tabListWidth.value
})

// --- Lifecycle hooks & related ---
// None
</script>

<template>
  <TabGroup as="div" :default-index="props.defaultIndex" @change="$emit('onTabChange', $event)">
    <div class="relative border-b border-divider dark:border-divider-dark">
      <div
        v-if="!arrivedState.left && canScroll"
        class="absolute left-0 z-10 h-full w-20 bg-linear-to-r from-main to-transparent pointer-events-none"
      ></div>
      <TabList
        ref="tabList"
        as="nav"
        class="hide-scrollbar scroll-shadows-x relative -mb-px flex w-full space-x-6 overflow-auto focus:outline-none p-1"
      >
        <slot name="tabs"></slot>
      </TabList>
      <div
        v-if="!arrivedState.right && canScroll"
        class="absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-main to-transparent pointer-events-none"
      ></div>
    </div>
    <TabPanels class="h-full">
      <slot name="tabPanels"></slot>
    </TabPanels>
  </TabGroup>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
