<script setup>
import { Popover, PopoverButton, PopoverPanel, TransitionRoot } from '@headlessui/vue'
import {
  autoUpdate,
  computePosition,
  flip,
  offset as offsetMiddleware,
  shift as shiftMiddleware,
  arrow as arrowMiddleware,
} from '@floating-ui/dom'
import { PopOverPlacement } from '../constant'
// --- Use ---
// None

// --- Props & models ---
const props = defineProps({
  flip: {
    type: Boolean,
    default: false, // beware - can cause rerendering issues if true
  },
  arrow: {
    type: Boolean,
    default: true,
  },
  offset: {
    type: Number,
    default: 12,
  },
  shift: {
    type: Number,
    default: 12,
  },
  /**
   * @type {PropType<typeof PopOverPlacement>}
   */
  placement: {
    type: String,
    default: 'bottom',
    validator: (place) => PopOverPlacement.includes(place),
  },
  menuItemsClasses: {
    type: String,
    default: '',
  },
  portal: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  show: {
    type: [Boolean, undefined],
    default: undefined,
  },
  showContent: {
    type: Boolean,
    default: true,
  },
})

// --- Emits ---
// None

// --- Vars ---
// None
const popoverPanelRef = ref(null)
const triggerRef = ref(null)
const arrowRef = ref(null)
const floatingStyles = ref({
  position: props.portal ? 'fixed' : 'absolute',
  top: '0px',
  left: '0px',
})
const arrowStyles = ref({})
const resolvedPlacement = ref(props.placement)
let cleanupAutoUpdate

const getTriggerEl = () => triggerRef.value?.$el ?? triggerRef.value ?? null
const getPanelEl = () => popoverPanelRef.value?.$el ?? popoverPanelRef.value ?? null

// --- Handlers ---
const middlewareForPlacement = () => {
  const middleware = [offsetMiddleware(props.offset)]
  if (props.shift !== false && props.shift !== null && props.shift !== undefined) {
    middleware.push(
      shiftMiddleware({
        padding: typeof props.shift === 'number' ? props.shift : 8,
      }),
    )
  }

  if (props.flip) {
    middleware.push(flip())
  }

  if (props.arrow && arrowRef.value) {
    middleware.push(
      arrowMiddleware({
        element: arrowRef.value,
      }),
    )
  }

  return middleware
}

const updateFloatingPosition = async () => {
  const referenceEl = getTriggerEl()
  const floatingEl = getPanelEl()
  if (!referenceEl || !floatingEl) return

  const { x, y, placement, middlewareData } = await computePosition(referenceEl, floatingEl, {
    placement: props.placement,
    strategy: props.portal ? 'fixed' : 'absolute',
    middleware: middlewareForPlacement(),
  })

  floatingStyles.value = {
    position: props.portal ? 'fixed' : 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    zIndex: 50,
  }

  resolvedPlacement.value = placement

  if (props.arrow && middlewareData.arrow && arrowRef.value) {
    const { x: arrowX, y: arrowY } = middlewareData.arrow
    arrowStyles.value = {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
    }
  }
}

const stopAutoUpdate = () => {
  if (cleanupAutoUpdate) {
    cleanupAutoUpdate()
    cleanupAutoUpdate = null
  }
}

const initAutoUpdate = () => {
  const referenceEl = getTriggerEl()
  const floatingEl = getPanelEl()
  if (!referenceEl || !floatingEl) return
  stopAutoUpdate()
  cleanupAutoUpdate = autoUpdate(referenceEl, floatingEl, () => {
    updateFloatingPosition()
  })
}

// --- Watchers & computed ---
watch(popoverPanelRef, (panel) => {
  const el = panel?.$el ?? panel
  if (el) {
    nextTick(() => el.focus?.())
  }
  if (panel) {
    nextTick(() => {
      updateFloatingPosition()
      initAutoUpdate()
    })
  } else {
    stopAutoUpdate()
  }
})

watch(
  () => [props.placement, props.offset, props.shift, props.flip, props.portal, props.arrow],
  () => {
    nextTick(() => updateFloatingPosition())
  },
)

watch(arrowRef, () => {
  if (arrowRef.value) {
    nextTick(() => updateFloatingPosition())
  }
})

onBeforeUnmount(() => {
  stopAutoUpdate()
})

const arrowOrientation = computed(() => {
  if (resolvedPlacement.value.startsWith('bottom')) return 'rotate-45'
  if (resolvedPlacement.value.startsWith('top')) return 'rotate-225'
  if (resolvedPlacement.value.startsWith('left')) return 'rotate-135'
  return '-rotate-45'
})

// --- Lifecycle hooks & related ---
// None
</script>

<template>
  <template v-if="disabled">
    <div><slot name="button" /></div>
  </template>
  <Popover v-else v-slot="{ open }" class="relative w-min">
    <PopoverButton as="div" ref="triggerRef" @click.stop>
      <slot name="button" v-bind:open="open" />
    </PopoverButton>

    <Teleport v-if="portal" to="body">
      <TransitionRoot
        as="template"
        :show="open && props.showContent"
        enter="transition duration-200 ease-out"
        enter-from="scale-95 opacity-0"
        enter-to="scale-100 opacity-100"
        leave="transition duration-150 ease-in"
        leave-from="scale-100 opacity-100"
        leave-to="scale-95 opacity-0"
      >
        <PopoverPanel
          v-slot="{ open: panelOpen, close }"
          ref="popoverPanelRef"
          tabindex="-1"
          :style="floatingStyles"
          :class="[
            'flex min-h-8 min-w-[124px] items-center rounded-xl border border-divider-hover bg-main-unselected text-sm text-sidebar-text shadow-xl ring-1 ring-black/5 focus:outline-none backdrop-blur-sm',
            props.menuItemsClasses,
          ]"
        >
          <div
            v-if="arrow"
            ref="arrowRef"
            class="pointer-events-none absolute h-2.5 w-2.5 border-l border-t border-divider-hover bg-main-unselected"
            :class="arrowOrientation"
            :style="arrowStyles"
          ></div>
          <div class="relative w-full overflow-hidden">
            <slot name="content" :open="panelOpen" :close="close" />
          </div>
        </PopoverPanel>
      </TransitionRoot>
    </Teleport>

    <TransitionRoot
      v-else
      as="template"
      :show="open && props.showContent"
      enter="transition duration-200 ease-out"
      enter-from="scale-95 opacity-0"
      enter-to="scale-100 opacity-100"
      leave="transition duration-150 ease-in"
      leave-from="scale-100 opacity-100"
      leave-to="scale-95 opacity-0"
    >
      <PopoverPanel
        v-slot="{ open: panelOpen, close }"
        ref="popoverPanelRef"
        tabindex="-1"
        :style="floatingStyles"
        :class="[
          'flex min-h-8 min-w-[124px] items-center rounded-xl border border-divider-hover bg-main-unselected text-sm text-sidebar-text shadow-xl ring-1 ring-black/5 focus:outline-none backdrop-blur-sm',
          props.menuItemsClasses,
        ]"
      >
        <div
          v-if="arrow"
          ref="arrowRef"
          class="pointer-events-none absolute h-2.5 w-2.5 border-l border-t border-divider-hover bg-main-unselected"
          :class="arrowOrientation"
          :style="arrowStyles"
        ></div>
        <div class="relative w-full overflow-hidden">
          <slot name="content" :open="panelOpen" :close="close" />
        </div>
      </PopoverPanel>
    </TransitionRoot>
  </Popover>
</template>
