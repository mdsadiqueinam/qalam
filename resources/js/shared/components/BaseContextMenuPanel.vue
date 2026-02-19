<script setup>
// --- Use ---
// None

// --- Props & models ---
const props = defineProps({
  childPlacement: String,
})

const contextMenuItems = defineModel('contextMenuItems')
const isDialogOpen = defineModel('isDialogOpen')
const dialogName = defineModel('dialogName')
const showMenu = defineModel('showMenu')
const toggleScroll = inject('toggleScroll')

// --- Emits ---
const emit = defineEmits(['persist'])

// --- Vars ---
const selectedFilter = shallowRef(null)

// --- Handlers ---
function close() {
  showMenu.value = false
  isDialogOpen.value = false
}

// --- Watchers & computed ---
watch(isDialogOpen, () => {
  emit('persist', isDialogOpen.value)
  toggleScroll(!isDialogOpen.value)
})

onUnmounted(() => {
  emit('persist', false)
})
</script>

<template>
  <template v-if="!selectedFilter">
    <contextMenuDropPickerPanel
      :items="contextMenuItems"
      v-model:selectedItemId="selectedFilter"
      :childPlacement="childPlacement"
      @close="close"
    ></contextMenuDropPickerPanel>
  </template>
  <slot
    name="baseSlotSwitch"
    :isDialogOpen="isDialogOpen"
    :dialogName="dialogName"
    :closeDialog="close"
  />
</template>
