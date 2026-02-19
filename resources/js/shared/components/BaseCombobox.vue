<script setup>
import { ref, computed, nextTick } from 'vue'
import { micromark } from 'micromark'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/solid'

// --- Use ---
// None

// --- Props & models ---
const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: '',
  },
  labelLeft: {
    type: Boolean,
    default: false,
  },
  labelRight: {
    type: Boolean,
    default: false,
  },
  instructions: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search...',
  },
  required: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: '',
  },
  labelWrapperClass: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    validator(value) {
      return ['sm', 'md'].includes(value)
    },
    default: 'md',
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  clearOnSelect: {
    type: Boolean,
    default: false,
  },
  optionValue: {
    type: [String, Number, Function],
    default: 'value',
  },
  optionLabel: {
    type: [String, Number, Function],
    default: 'label',
  },
  itemRemovable: {
    type: Boolean,
    default: true,
  },
  duplicate: {
    type: Boolean,
    default: false,
  },
  newValue: {
    type: Function,
    default: undefined,
  },
})

const selectedItem = defineModel({
  type: [Array, String, Number, Object],
  default: () => [],
})

// --- Emits ---
// None
const emit = defineEmits(['blur', 'focus', 'keypress', 'keydown', 'keyup', 'remove'])
const slots = useSlots()

// --- Vars ---
const inputEl = ref(null)
const editItemIndex = ref(null)
const embeddedComboboxRefs = ref(null)
const optionWidth = ref('auto')
const newItemIndex = ref(null)
const newItem = ref()

defineExpose({
  inputEl,
  focus,
})

const query = ref('')

// --- Handlers ---
function select(item) {
  if (props.multiple) {
    selectedItem.value = [...selectedItem.value, item]
  } else {
    selectedItem.value = item
  }
  onSelected()
}

function focus(position) {
  if (!inputEl.value?.el) {
    return
  }

  inputEl.value.el.focus()
  if (position !== undefined) {
    inputEl.value.el.setSelectionRange(position, position)
  }
}

function blur() {
  if (!inputEl.value?.el) {
    return
  }

  inputEl.value.el.blur()
  inputEl.value.el.value = ''
}

function onSelected() {
  if (props.clearOnSelect) {
    blur()
    focus()
    query.value = ''
  }
}

function onBackspace() {
  if (query.value === '' && selectedItem.value.length > 0) {
    // Remove the last selected item
    selectedItem.value = selectedItem.value.slice(0, -1)
  }
}

function moveLeft(index, isAtStart) {
  let changed = false

  // Move focus to the previous item
  // if the index is at the start(0) check newItemIndex is null so that new item can add at 0
  if (isAtStart && (index > 0 || newItemIndex.value === null)) {
    if (newItemIndex.value === null && editItemIndex.value !== null) {
      // when moving left editItemIndex will remain same newItemIndex will be set to editItemIndex
      // to set new item like if editItemIndex is 2 then we set newItemIndex to 2 to add new item at index 2
      newItemIndex.value = editItemIndex.value
    } else {
      // Move the editItemIndex left and set newItemIndex to null to edit current selected item at editItemIndex
      editItemIndex.value = index - 1
      newItemIndex.value = null
    }
    changed = true
  }

  return changed
}

function moveRight(index, isAtEnd) {
  let changed = false

  if (isAtEnd && (index < selectedItem.value.length - 1 || newItemIndex.value !== null)) {
    if (newItemIndex.value === null && editItemIndex.value !== null) {
      // When moving right editItemIndex will also need to increase because
      // editItemIndex and newItemIndex are both used to track the new item being inserted
      // like if newItemIndex is 0 then here newItemIndex will be set to 1 and editItemIndex will also need to be 1
      // for the functionality to work properly
      newItemIndex.value = editItemIndex.value + 1
      editItemIndex.value = editItemIndex.value + 1
    } else {
      // Move the editItemIndex right and set newItemIndex to null to edit current selected item and
      // editItemIndex will remain same
      editItemIndex.value = index
      newItemIndex.value = null
    }
    changed = true
  } else if (isAtEnd) {
    // Reset both indices if at end
    editItemIndex.value = null
    newItemIndex.value = null
  }

  return changed
}

function onLeftOrRight(event) {
  const cursorPosition = event.target.selectionStart
  const targetValue = event.target.value
  const isAtStart = cursorPosition === 0
  const isAtEnd = cursorPosition === targetValue.length

  if (!props.multiple) return

  const index = editItemIndex.value !== null ? editItemIndex.value : selectedItem.value.length
  let changed = false

  if (event.code === 'ArrowLeft') {
    changed = moveLeft(index, isAtStart)
  } else if (event.code === 'ArrowRight') {
    changed = moveRight(index, isAtEnd)
  }

  nextTick(() => {
    if (embeddedComboboxRefs.value?.length && changed) {
      embeddedComboboxRefs.value[0].focus(0)
    } else {
      focus(0)
    }
  })
}

function onSpace(event) {
  if (filteredOptions.value.length === 1) {
    event.preventDefault()
    const activeOption = filteredOptions.value[0]
    select(activeOption)
  }
}

const OnKeydownEvent = {
  Backspace: onBackspace,
  ArrowLeft: onLeftOrRight,
  ArrowRight: onLeftOrRight,
  Space: onSpace,
}

function onKeydown(event) {
  const onKeydownEvent = OnKeydownEvent[event.code]
  if (onKeydownEvent) {
    onKeydownEvent(event)
  }
  emit('keydown', event)
}

function onComboboxKeydown(event) {
  if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
    onLeftOrRight(event)
  } else if (event.code === 'Enter') {
    nextTick(() => {
      moveRight(editItemIndex.value, true)
      // this will focus after the Combobox input renders
      nextTick(focus)
    })
  }
}

function onComboboxBlur(event) {
  nextTick(() => {
    const blurredEl = event.target
    const currentEl = embeddedComboboxRefs.value?.[0]?.inputEl?.el
    const isSame = blurredEl === currentEl

    if (isSame) {
      newItemIndex.value = null
      editItemIndex.value = null
      newItem.value = undefined
    }
  })
}

function removeChip(idx) {
  const items = [...selectedItem.value]
  const removed = items.splice(idx, 1)
  selectedItem.value = items
  emit('remove', removed[0])
}

function getComboboxOptionLabel(item) {
  if (props.multiple) return ''
  return getOptionLabel.value(item)
}

function onEditItem() {
  // Reset selectedItem to ensure it reflects the latest state
  selectedItem.value = [...selectedItem.value]
  nextTick(focus)
}

function onNewItem() {
  const item = newItem.value
  const itemValue = getOptionValue.value(item)
  if (itemValue || itemValue === 0) {
    const selected = [...selectedItem.value]
    selected.splice(newItemIndex.value, 0, item)
    selectedItem.value = selected
    newItemIndex.value = null
    newItem.value = undefined
  }
}

function compareItem(a, b) {
  return getOptionValue.value(a) === getOptionValue.value(b)
}

function comparisonFn(a, b) {
  if (props.duplicate) {
    return false
  }

  return compareItem(a, b)
}

// --- Watchers & computed ---
const getOptionValue = computed(() => {
  if (typeof props.optionValue === 'function') {
    return props.optionValue
  }
  return (item) => {
    if (typeof item === 'object' && item !== null) {
      return item[props.optionValue]
    }

    if (Array.isArray(item)) {
      return item[Number(props.optionValue)]
    }

    return item
  }
})

const getOptionLabel = computed(() => {
  if (typeof props.optionLabel === 'function') {
    return props.optionLabel
  }
  return (item) => {
    if (typeof item === 'object' && item !== null) {
      return item[props.optionLabel]
    }

    if (Array.isArray(item)) {
      return item[Number(props.optionLabel)]
    }

    return item
  }
})

const filteredOptions = computed(() => {
  const filtered =
    query.value === ''
      ? props.options
      : props.options.filter((item) => {
          const label = getOptionLabel.value(item)
          return label.toLowerCase().includes(query.value.toLowerCase())
        })

  if (typeof props.newValue === 'function') {
    const newItem = props.newValue(query.value)
    if (newItem) {
      return [...filtered.slice(0, 5), newItem]
    }
  }

  return filtered.slice(0, 5)
})

const inline = computed(() => props.labelLeft || props.labelRight)

const cssClass = computed(() => {
  let c =
    'flex items-center w-full border border-divider rounded-lg bg-main focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:text-grey-5 overflow-x-auto max-w-[900px] transition-[border,box-shadow] duration-300'
  //   if (props.size === 'sm') c += ' h-6 px-2 text-12';
  //   else c += ' h-10';
  if (props.inputClass) c += ' ' + props.inputClass
  return c
})

// --- Lifecycle hooks & related ---
onMounted(() => {
  if (props.autofocus) {
    focus()
  }

  if (inputEl.value?.el) {
    optionWidth.value = `${inputEl.value.el.clientWidth + 50}px`
  }
})
</script>

<template>
  <div class="rounded-lg" :class="{ 'flex items-center': inline, 'flex-row-reverse': labelRight }">
    <div
      v-if="label || slots.label || instructions"
      :class="labelWrapperClass ? labelWrapperClass : 'mb-4'"
    >
      <label
        v-if="label || slots.label"
        class="dark:text-white"
        :class="{
          'inline-block': !inline,
          '-mb-2': !inline && size === 'md',
          'text-12': size === 'sm',
          'mr-2': labelLeft,
          'ml-2': labelRight,
        }"
        :for="name"
      >
        <slot name="label">
          {{ label }}
          <span v-if="required" class="text-red">*</span>
        </slot>
      </label>
      <div
        v-if="instructions"
        class="text-grey-5 dark:text-grey-4 max-w-none dark:prose-invert [&>p>a]:underline"
        :class="{
          'text-14 mb-4': size === 'md',
          'text-12': size === 'sm',
        }"
        v-html="micromark(instructions).replace('href=', 'target=\'_blank\' href=')"
      />
    </div>

    <div :class="cssClass">
      <div
        v-if="props.multiple && selectedItem.length > 0"
        class="inline-flex max-h-10 items-center gap-1 p-1"
      >
        <template v-for="(item, idx) in selectedItem" :key="getOptionValue(item)">
          <BaseCombobox
            v-if="newItemIndex === idx"
            ref="embeddedComboboxRefs"
            v-model="newItem"
            inputClass="border-0"
            autofocus
            :options="props.options"
            :placeholder="props.placeholder"
            :optionValue="props.optionValue"
            :optionLabel="props.optionLabel"
            :newValue="props.newValue"
            @keydown="onComboboxKeydown"
            @blur="onComboboxBlur"
            @update:modelValue="onNewItem"
          />

          <BaseCombobox
            v-if="editItemIndex === idx && newItemIndex === null"
            ref="embeddedComboboxRefs"
            v-model="selectedItem[idx]"
            inputClass="border-0"
            autofocus
            :options="props.options"
            :placeholder="props.placeholder"
            :optionValue="props.optionValue"
            :optionLabel="props.optionLabel"
            :newValue="props.newValue"
            @keydown="onComboboxKeydown"
            @blur="onComboboxBlur"
            @update:modelValue="onEditItem"
          />

          <template v-else>
            <slot name="chip" :item="item" :index="idx" :remove="() => removeChip(idx)">
              <BaseChip
                :label="getOptionLabel(item)"
                class="whitespace-nowrap"
                :removable="props.itemRemovable"
                :style="{ maxWidth: optionWidth }"
                @onRemove="removeChip(idx)"
                @click="editItemIndex = idx"
              />
            </slot>
          </template>
        </template>
      </div>

      <Combobox
        v-if="editItemIndex === null"
        v-model="selectedItem"
        :multiple="props.multiple"
        :by="comparisonFn"
        @update:modelValue="onSelected"
      >
        <div class="relative">
          <ComboboxInput
            ref="inputEl"
            :placeholder="props.placeholder"
            class="combobox-input h-10 w-[180px] border-0 bg-transparent ring-0 focus:border-0 focus:ring-0 disabled:cursor-not-allowed"
            :displayValue="getComboboxOptionLabel"
            @change="query = $event.target.value"
            @keydown="onKeydown"
            @keypress="emit('keypress', $event)"
            @keyup="emit('keyup', $event)"
            @focus="emit('focus', $event)"
            @blur="emit('blur', $event)"
          />

          <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            @after-leave="query = ''"
          >
            <ComboboxOptions
              class="combobox-options z-10 mt-1 max-h-60 w-fit min-w-[124px] overflow-auto rounded-md border border-danger bg-main-unselected py-1 text-base opacity-100 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
              :style="{ width: optionWidth }"
            >
              <BaseComboboxOption
                v-for="item in filteredOptions"
                :key="getOptionValue(item)"
                :value="item"
                :label="getOptionLabel(item)"
              >
                <template #indicator="{ selected }">
                  <!-- Show selection indicator when not in duplicate mode -->
                  <span v-if="!props.duplicate" class="w-[15px]">
                    <CheckIcon v-show="selected" />
                  </span>
                </template>
              </BaseComboboxOption>
            </ComboboxOptions>
          </TransitionRoot>
        </div>
      </Combobox>
    </div>
  </div>
</template>

<style lang="scss">
.combobox-input {
  anchor-name: --combobox-anchor;
}

.combobox-options {
  position-anchor: --combobox-anchor;
  position: fixed;
  inset-block-start: anchor(end);
}
</style>
