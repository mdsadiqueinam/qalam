<script setup>
import { TransitionRoot } from '@headlessui/vue'
import {
  autoUpdate,
  computePosition,
  flip,
  offset as offsetMiddleware,
  shift as shiftMiddleware,
} from '@floating-ui/dom'
import { vOnClickOutside } from '@vueuse/components'

// --- Use ---
const {
  show: showNestedMenu,
  open: openNestedMenu,
  close: closeNestedMenu,
  delayClose: delayCloseNestedMenu,
  toggle,
} = useHoverMenu()

// --- Props & models ---
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
  },
  arrow: {
    type: Boolean,
    default: true,
  },
  buttonWrapperClass: {
    type: String,
    default: '',
  },
})

// --- Emits ---
// None

// --- Vars ---
// None
const triggerRef = ref(null)
const menuRef = ref(null)
const floatingStyles = ref({
  position: 'fixed',
  top: '0px',
  left: '0px',
  zIndex: 60,
})
let cleanupAutoUpdate

// --- Handlers ---
// None

const updateMenuPosition = async () => {
  if (!triggerRef.value || !menuRef.value) return

  const { x, y } = await computePosition(triggerRef.value, menuRef.value, {
    placement: 'bottom-start',
    strategy: 'fixed',
    middleware: [offsetMiddleware(8), shiftMiddleware({ padding: 8 }), flip()],
  })

  floatingStyles.value = {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    zIndex: 60,
  }
}

const stopAutoUpdate = () => {
  if (cleanupAutoUpdate) {
    cleanupAutoUpdate()
    cleanupAutoUpdate = null
  }
}

const initAutoUpdate = () => {
  if (!triggerRef.value || !menuRef.value) return
  stopAutoUpdate()
  cleanupAutoUpdate = autoUpdate(triggerRef.value, menuRef.value, () => {
    updateMenuPosition()
  })
}

// --- Watchers & computed ---
// None

watch(
  () => showNestedMenu.value,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        updateMenuPosition()
        initAutoUpdate()
      })
    } else {
      stopAutoUpdate()
    }
  },
)

watch([triggerRef, menuRef], () => {
  if (showNestedMenu.value) {
    nextTick(() => {
      updateMenuPosition()
      initAutoUpdate()
    })
  }
})

onBeforeUnmount(() => {
  stopAutoUpdate()
})

function useHoverMenu(delay = 150) {
  const show = ref(false)
  const timer = ref(null)

  const open = () => {
    if (timer.value !== null) {
      clearTimeout(timer.value)
      timer.value = null
    }
    show.value = true
  }

  const close = () => (show.value = false)

  const delayClose = () => {
    timer.value = setTimeout(() => {
      show.value = false
    }, delay)
  }

  const toggle = () => {
    show.value = !show.value
  }

  return { show, timer, open, close, delayClose, toggle }
}
</script>

<template>
  <div
    ref="triggerRef"
    @click="toggle"
    v-on-click-outside="delayCloseNestedMenu"
    :class="buttonWrapperClass"
  >
    <slot name="button" v-bind:open="showNestedMenu" />
  </div>

  <Teleport to="body">
    <TransitionRoot
      as="template"
      :show="showNestedMenu"
      enter="transition duration-200 ease-out"
      enter-from="scale-95 opacity-0"
      enter-to="scale-100 opacity-100"
      leave="transition duration-150 ease-in"
      leave-from="scale-100 opacity-100"
      leave-to="scale-95 opacity-0"
    >
      <div ref="menuRef" :style="floatingStyles">
        <BaseNestedDropMenuPanel :items="props.items" @close="closeNestedMenu" />
      </div>
    </TransitionRoot>
  </Teleport>
</template>
