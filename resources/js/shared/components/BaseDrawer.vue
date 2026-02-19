<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  maxWidth: {
    type: String,
    default: 'max-w-lg',
  },
  name: {
    type: String,
    default: 'Panel name',
  },
})

const slots = useSlots()

const emit = defineEmits(['close'])

const open = defineModel(false)

function close() {
  emit('close')
  open.value = false
}
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-hidden" @click="close">
        <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-300"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <DialogPanel
              class="relative z-20 w-screen border-l border-main-selected bg-main shadow-xl ring-1 ring-black/5 dark:text-white"
              :class="[maxWidth, { 'flex flex-col': slots.footer }]"
            >
              <div
                class="flex h-full flex-col overflow-y-scroll py-3"
                :class="{ grow: slots.footer }"
              >
                <div class="flex px-4 sm:px-6">
                  <slot name="header">
                    <slot name="beforeTitle" />
                    <DialogTitle class="text-base font-semibold">{{ name }}</DialogTitle>
                    <slot name="afterTitle" />
                  </slot>
                  <button
                    class="ml-auto mr-3 flex rounded-full p-1 transition-[border,background-color,color,opacity] duration-300 hover:bg-main-unselected-hover hover:text-main-text-hover"
                    @click="close"
                  >
                    <XMarkIcon class="size-5" />
                  </button>
                </div>
                <div class="relative mt-4 flex-1 px-4 sm:px-6">
                  <!-- Your content -->
                  <slot></slot>
                </div>
              </div>
              <template v-if="slots.footer">
                <div class="flex min-h-20 border-separate border">
                  <slot name="footer"></slot>
                </div>
              </template>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
