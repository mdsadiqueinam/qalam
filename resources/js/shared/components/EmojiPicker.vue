<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { EMOJI_GROUPS } from '../constant'
import { useCompanyLocalStorage } from '@root/utils/useCompanyLocalStorage.js'
import { useScroll } from '@vueuse/core'

// --- Props & models ---
const props = defineProps({
  multiple: {
    type: Boolean,
    default: true,
  },
  maxSelections: {
    type: Number,
    default: null,
  },
  showFrequentlyUsed: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

// --- State ---
const selectedEmojis = defineModel({
  type: Array,
  default: () => [],
})

const searchQuery = ref('')
const activeGroup = ref(0)
const frequentlyUsed = useCompanyLocalStorage('frequently-used-emojis', [])
const emojiGridRef = ref(null)
const { y: scrollY } = useScroll(emojiGridRef, { behavior: 'smooth' })

// --- Computed ---

// Search functionality
const filteredEmojiGroups = computed(() => {
  EMOJI_GROUPS['frequently-used'].emojis = frequentlyUsed.value
  const groupedEmojis = Object.values(EMOJI_GROUPS)

  if (!searchQuery.value) {
    return groupedEmojis.filter((group) => group.emojis.length > 0)
  }

  const query = searchQuery.value.toLowerCase()
  return groupedEmojis
    .map((group) => ({
      ...group,
      emojis: group.emojis.filter((emoji) => {
        const icon = emoji.icon.toLowerCase()
        const name = emoji.name.toLowerCase()
        const code = (emoji.code || []).join(' ').toLowerCase()

        return icon.includes(query) || name.includes(query) || code.includes(query)
      }),
    }))
    .filter((group) => group.emojis.length > 0)
})

const canSelectMore = computed(() => {
  if (!props.maxSelections) return true
  return selectedEmojis.value.length < props.maxSelections
})

// --- Methods ---
const selectEmoji = (emoji) => {
  const emojiIcon = emoji.icon

  if (!props.multiple) {
    selectedEmojis.value = [emojiIcon]
    updateFrequentlyUsed(emoji)
    nextTick(() => emit('close'))
    return
  }

  const currentIndex = selectedEmojis.value.indexOf(emojiIcon)
  if (currentIndex > -1) {
    // Remove emoji if already selected
    selectedEmojis.value = selectedEmojis.value.filter((icon) => icon !== emojiIcon)
  } else if (canSelectMore.value) {
    // Add emoji if not selected and under limit
    selectedEmojis.value = [...selectedEmojis.value, emojiIcon]
    updateFrequentlyUsed(emoji)
  }
  nextTick(() => emit('close'))
}

const isSelected = (emoji) => {
  const emojiIcon = emoji.icon
  return selectedEmojis.value.includes(emojiIcon)
}

const setActiveGroup = (idx) => {
  activeGroup.value = idx

  // Scroll to the group
  nextTick(() => {
    if (emojiGridRef.value) {
      const groupElement = emojiGridRef.value.querySelector(`#emoji-group-${idx}`)
      if (groupElement) {
        const containerTop = emojiGridRef.value.getBoundingClientRect().top
        const groupTop = groupElement.getBoundingClientRect().top
        const scrollOffset = groupTop - containerTop + emojiGridRef.value.scrollTop - 10 // 10px padding

        emojiGridRef.value.scrollTo({
          top: scrollOffset,
          behavior: 'smooth',
        })
      }
    }
  })
}

const updateFrequentlyUsed = (emoji) => {
  if (!props.showFrequentlyUsed) return

  const currentFrequent = [...frequentlyUsed.value]
  const existingIndex = currentFrequent.findIndex((item) => item.icon === emoji.icon)

  if (existingIndex > -1) {
    // Move to front
    currentFrequent.splice(existingIndex, 1)
    currentFrequent.unshift(emoji)
  } else {
    // Add to front, limit to 20 emojis
    currentFrequent.unshift(emoji)
    if (currentFrequent.length > 20) {
      currentFrequent.pop()
    }
  }

  frequentlyUsed.value = currentFrequent
}

// Watch scroll position to update active group
watch(scrollY, () => {
  if (!emojiGridRef.value || searchQuery.value) return // Don't update active group when searching

  const scrollContainer = emojiGridRef.value
  const scrollTop = scrollContainer.scrollTop
  const containerHeight = scrollContainer.clientHeight

  // Find which group is most visible
  let bestMatch = 0
  let bestVisibility = 0

  filteredEmojiGroups.value.forEach((group, index) => {
    const groupElement = scrollContainer.querySelector(`#emoji-group-${index}`)
    if (!groupElement) return

    const rect = groupElement.getBoundingClientRect()
    const containerRect = scrollContainer.getBoundingClientRect()

    // Calculate how much of the group is visible
    const groupTop = rect.top - containerRect.top
    const groupBottom = rect.bottom - containerRect.top

    const visibleTop = Math.max(0, groupTop)
    const visibleBottom = Math.min(containerHeight, groupBottom)
    const visibleHeight = Math.max(0, visibleBottom - visibleTop)

    const visibility = visibleHeight / Math.min(rect.height, containerHeight)

    if (visibility > bestVisibility) {
      bestVisibility = visibility
      bestMatch = index
    }
  })

  if (bestVisibility > 0.3) {
    // Only update if at least 30% of group is visible
    activeGroup.value = bestMatch
  }
})

// --- Lifecycle ---
</script>

<template>
  <div
    class="emoji-picker flex h-96 w-80 flex-col rounded-lg border border-divider bg-sidebar shadow-lg"
  >
    <!-- Search Input -->
    <div class="border-b border-divider p-3">
      <div class="relative">
        <MagnifyingGlassIcon
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="placeholder:main-unselected-text block h-7 w-full rounded-lg border border-divider bg-main-unselected py-2 pl-10 pr-3 text-sm ring-0 placeholder:text-sm focus:border-transparent focus:outline-none focus:ring-0"
        />
      </div>
    </div>

    <!-- Selection Counter (if multiple and maxSelections) -->
    <div
      v-if="props.multiple && props.maxSelections"
      class="border-b border-divider bg-sidebar-selected px-3 py-1 text-xs"
    >
      {{ selectedEmojis.length }}/{{ props.maxSelections }} selected
    </div>

    <!-- Group Tabs -->
    <div class="scrollbar-hide flex overflow-x-auto border-b border-divider bg-sidebar">
      <button
        v-for="(tab, idx) in filteredEmojiGroups"
        :key="tab.name"
        @click="setActiveGroup(idx)"
        :class="[
          'flex-shrink-0 px-3 py-2 text-lg transition-colors duration-150 hover:bg-sidebar-unselected-hover',
          activeGroup === idx ? 'bg-sidebar-selected' : '',
        ]"
        :title="tab.name"
      >
        {{ tab.icon }}
      </button>
    </div>

    <!-- Emoji Grid -->
    <div ref="emojiGridRef" class="flex-1 overflow-y-auto p-3">
      <div
        v-for="(group, idx) in filteredEmojiGroups"
        :key="group.name"
        :id="`emoji-group-${idx}`"
        class="mb-4 last:mb-0"
      >
        <h3 class="mb-2 text-sm font-medium">{{ group.name }}</h3>
        <div class="grid grid-cols-8 gap-1">
          <button
            v-for="emoji in group.emojis"
            :key="emoji"
            @click="selectEmoji(emoji)"
            :disabled="!props.multiple && !canSelectMore && !isSelected(emoji)"
            :class="[
              'relative flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors duration-150 hover:bg-sidebar-selected',
              isSelected(emoji) ? 'bg-sidebar-selected' : '',
              !canSelectMore && !isSelected(emoji)
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer',
            ]"
            :title="typeof emoji === 'string' ? emoji : `${emoji.name} - ${emoji.description}`"
          >
            {{ emoji.icon }}
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="searchQuery && Object.keys(filteredEmojiGroups).length === 0"
        class="py-8 text-center"
      >
        <div class="mb-2 text-2xl">🤔</div>
        <div class="text-sm">No emojis found</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emoji-picker {
  font-family:
    'Apple Color Emoji', 'Segoe UI Emoji', 'NotoColorEmoji', 'Segoe UI Symbol', 'Android Emoji',
    sans-serif;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
