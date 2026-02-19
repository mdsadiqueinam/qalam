<script setup>
// --- Use ---
// None

// --- Props & models ---
const props = defineProps(['contextMenuPosition'])
const showMenu = defineModel('showMenu')
const childPlacement = ref('right-start')
// --- Emits ---
// None

// --- Vars ---
const persist = ref(false)
const popoverPanelRef = ref(null)
const menuX = ref(props.contextMenuPosition.x)
const menuY = ref(props.contextMenuPosition.y)

// --- Handlers ---
// Close popover when clicking outside
const closeContextMenu = (event) => {
  if (showMenu.value) {
    if (popoverPanelRef.value && !persist.value) {
      if (!popoverPanelRef.value.contains(event.target)) {
        showMenu.value = false
        document.removeEventListener('mousedown', closeContextMenu, true)
      }
    }
  }
}

function updatePersist(e) {
  persist.value = e
}

function preventDefault(e) {
  e.preventDefault()
}

function toggleScroll(disable) {
  eventOptions.forEach(([event, handler, options]) => {
    window[disable ? 'addEventListener' : 'removeEventListener'](event, handler, options)
  })
}

let supportsPassive = false
try {
  window.addEventListener(
    'stopScroll',
    null,
    Object.defineProperty({}, 'passive', {
      get: () => (supportsPassive = true),
    }),
  )
} catch (e) {}

const wheelOpt = supportsPassive ? { passive: false } : false
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

const eventOptions = [
  ['DOMMouseScroll', preventDefault, false],
  [wheelEvent, preventDefault, wheelOpt],
  ['touchmove', preventDefault, wheelOpt],
]

// --- Watchers & computed ---
// None

// --- Lifecycle hooks & related ---
onMounted(() => {
  document.addEventListener('mousedown', closeContextMenu, true)
  const { clientWidth: menuWidth, clientHeight: menuHeight } = popoverPanelRef.value
  const { innerWidth: screenWidth, innerHeight: screenHeight } = window

  if (menuX.value > screenWidth - menuWidth - 50) {
    const placeArray = childPlacement.value.split('-')
    placeArray[0] = 'left'
    childPlacement.value = placeArray.join('-')
  }

  if (menuY.value > screenHeight - menuHeight - 50) {
    const placeArray = childPlacement.value.split('-')
    placeArray[1] = 'end'
    childPlacement.value = placeArray.join('-')
  }
  menuX.value = Math.min(menuX.value, screenWidth - menuWidth - 50)
  menuY.value = Math.min(menuY.value, screenHeight - menuHeight - 20)

  toggleScroll(true)

  popoverPanelRef.value.addEventListener('wheel', (e) => e.stopPropagation(), { passive: false })
  popoverPanelRef.value.addEventListener('touchmove', (e) => e.stopPropagation(), {
    passive: false,
  })
})

onUnmounted(() => {
  document.removeEventListener('mousedown', closeContextMenu, true)
  toggleScroll(false)
})

provide('toggleScroll', toggleScroll)
</script>
<template>
  <Teleport to="body">
    <div
      ref="popoverPanelRef"
      class="absolute z-50 flex min-h-8 min-w-[124px] items-center rounded-xl border border-divider-hover bg-main-unselected text-sm text-sidebar-text shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none"
      :style="{ top: menuY + 'px', left: menuX + 'px' }"
      :class="{ invisible: persist }"
    >
      <slot name="content" :updatePersist="updatePersist" :childPlacement="childPlacement" />
    </div>
  </Teleport>
</template>
