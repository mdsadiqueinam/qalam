<script setup>
import { ChevronDownIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// --- Use ---
const slots = useSlots()

// --- Props & models ---
const props = defineProps({
  is: {
    type: [String, null],
    default: null,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  showText: {
    type: Boolean,
    default: true,
  },
  heightClass: {
    type: String,
    default: 'h-8',
  },
  iconSizeClass: {
    type: String,
    default: 'size-5',
  },
  useFixedWidth: {
    type: Boolean,
    default: false,
  },
  widthClass: {
    type: String,
    default: '',
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
  showDropdownIconForEdit: {
    type: Boolean,
    default: true,
  },
  showClear: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'danger', 'info'].includes(value),
  },
  showStatusDot: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value),
  },
  interactive: {
    type: Boolean,
    default: true,
  },
})

// --- Emits ---
const emit = defineEmits(['clear'])

// --- Vars ---
// None

// --- Handlers ---
// None

// --- Watchers & computed ---
const VARIANT_STYLES = {
  success: 'bg-good/10 text-good ring-1 ring-inset ring-good/20',
  warning: 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/20',
  danger: 'bg-danger/10 text-danger ring-1 ring-inset ring-danger/20',
  info: 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20',
}

const cssClass = computed(() => {
  const classes = [props.heightClass]

  if (props.variant === 'default') {
    if (props.isOpen) {
      classes.push('border-divider-hover bg-main-unselected-hover text-main-text-hover')
    } else if (props.canEdit) {
      classes.push(
        'bg-main text-main-text hover:border-divider-hover hover:bg-main-unselected-hover hover:text-main-text-hover',
      )
    } else {
      classes.push('bg-main text-main-text border-divider-subtle')
    }
  } else {
    classes.push(VARIANT_STYLES[props.variant] ?? VARIANT_STYLES.info)
  }

  if (props.useFixedWidth) classes.push('w-[36px] lg:w-[80px] xl:w-[130px]')
  else if (props.widthClass) classes.push(props.widthClass)

  classes.push(props.showClear ? 'pr-px!' : 'rounded-full')

  return classes.join(' ')
})

const statusDotClass = computed(() => {
  const dotStyles = {
    success: 'bg-good',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-primary',
    default: 'bg-main-text',
  }

  if (props.variant === 'default') return dotStyles.default
  return dotStyles[props.variant] ?? dotStyles.default
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return {
        padding: 'px-1.5 py-0.5',
        text: 'text-xs',
        dot: 'h-1 w-1',
        gap: 'gap-0.5',
      }
    case 'sm':
      return {
        padding: 'px-2 py-0.5',
        text: 'text-xs',
        dot: 'h-1.5 w-1.5',
        gap: 'gap-1',
      }
    case 'md':
      return {
        padding: 'px-2.5 py-1',
        text: 'text-xs',
        dot: 'h-1.5 w-1.5',
        gap: 'gap-1',
      }
    case 'lg':
      return {
        padding: 'px-3 py-1.5',
        text: 'text-sm',
        dot: 'h-2 w-2',
        gap: 'gap-1.5',
      }
    default:
      return {
        padding: 'px-2.5 py-1',
        text: 'text-xs',
        dot: 'h-1.5 w-1.5',
        gap: 'gap-1',
      }
  }
})
</script>

<template>
  <component
    :is="props.is ? props.is : 'span'"
    :tabindex="props.interactive ? 0 : undefined"
    :class="[
      'group inline-flex shrink-0 items-center overflow-hidden text-nowrap transition-[border,background-color,color,opacity] duration-300',
      props.interactive
        ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
        : 'cursor-default focus:outline-none focus:ring-0 focus:ring-offset-0',
      cssClass,
      sizeClasses.padding,
      sizeClasses.text,
      sizeClasses.gap,
      props.variant === 'default' ? 'rounded-xl border border-divider pl-1.5 pr-2' : 'rounded-full',
    ]"
    :type="props.is === 'button' ? 'button' : undefined"
  >
    <span
      v-if="slots.icon || (props.showStatusDot && props.variant !== 'default')"
      class="shrink-0 flex items-center justify-center"
    >
      <slot name="icon">
        <!-- Status dot for modern variants -->
        <div class="rounded-full inline-block" :class="[statusDotClass, sizeClasses.dot]"></div>
      </slot>
    </span>
    <div
      v-if="props.showText"
      class="grow overflow-hidden text-ellipsis whitespace-nowrap text-left"
      :class="{
        'hidden lg:inline': props.useFixedWidth,
      }"
    >
      <slot />
    </div>
    <slot name="append" />
    <ChevronDownIcon
      v-if="props.canEdit && props.showDropdownIconForEdit"
      class="size-2 shrink-0"
    />
    <!-- clear -->
    <button
      v-if="props.showClear"
      class="flex h-7 w-7 min-w-7 items-center justify-center gap-1.5 rounded-lg border border-transparent text-sm text-main-text transition-[border,background-color,color,opacity] duration-300 hover:bg-main-unselected-hover hover:text-main-text-hover hover:brightness-90 group-hover:border-divider-hover group-hover:bg-main-unselected hover:dark:brightness-125"
      @click.stop="emit('clear')"
    >
      <XMarkIcon class="size-4" />
    </button>
  </component>
</template>
