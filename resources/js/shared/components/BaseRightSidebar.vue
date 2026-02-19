<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  maxWidth: {
    type: String,
    default: 'max-w-[420px]',
  },
  name: {
    type: String,
    default: 'Panel name',
  },
  onSubmit: {
    type: Function,
    default: null,
  },
})

const slots = useSlots()

const emit = defineEmits(['close', 'submit'])

const open = defineModel({
  type: Boolean,
  default: false,
})

function close() {
  emit('close')
  open.value = false
}

function submit() {
  if (props.onSubmit) {
    emit('submit')
  }
}
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-50">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity" />
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
              class="relative z-20 w-screen border-l shadow-2xl bg-white/85 dark:bg-[#141414]/65 backdrop-blur-md border-black/10 dark:border-white/10"
              style="box-shadow: -4px 0 16px rgba(0, 0, 0, 0.04)"
              :class="[maxWidth, { 'flex flex-col': slots.footer }]"
              @click.stop
            >
              <form
                v-if="onSubmit"
                @submit.prevent="props.onSubmit"
                class="flex h-full flex-col relative"
                :class="{ grow: slots.footer }"
              >
                <!-- Form Wrapper -->
                <button type="submit" class="hidden" />
                <!-- Helper for implicit submission -->

                <!-- Sticky Header -->
                <div
                  class="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10 bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md border-black/5 dark:border-white/5"
                >
                  <slot name="header">
                    <slot name="beforeTitle" />
                    <DialogTitle class="text-lg font-semibold text-main-text">{{
                      name
                    }}</DialogTitle>
                    <slot name="afterTitle" />
                  </slot>
                  <button
                    class="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-main-text-muted hover:text-main-text focus:outline-none"
                    @click="close"
                    type="button"
                  >
                    <XMarkIcon class="size-5" />
                  </button>
                </div>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                  <div class="flex flex-col gap-[18px]">
                    <slot></slot>
                  </div>
                </div>

                <!-- Sticky Footer -->
                <template v-if="slots.footer">
                  <div
                    class="flex items-center justify-end gap-3 px-6 py-4 border-t sticky bottom-0 z-10 bg-white/90 dark:bg-[#141414]/90 backdrop-blur-md border-black/5 dark:border-white/5"
                  >
                    <slot name="footer"></slot>
                  </div>
                </template>
              </form>

              <div v-else class="flex h-full flex-col relative" :class="{ grow: slots.footer }">
                <!-- Non-Form Wrapper -->
                <!-- Sticky Header -->
                <div
                  class="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10 bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md border-black/5 dark:border-white/5"
                >
                  <slot name="header">
                    <slot name="beforeTitle" />
                    <DialogTitle class="text-lg font-semibold text-main-text">{{
                      name
                    }}</DialogTitle>
                    <slot name="afterTitle" />
                  </slot>
                  <button
                    class="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-main-text-muted hover:text-main-text focus:outline-none"
                    @click="close"
                  >
                    <XMarkIcon class="size-5" />
                  </button>
                </div>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                  <div class="flex flex-col gap-[18px]">
                    <slot></slot>
                  </div>
                </div>

                <!-- Sticky Footer -->
                <template v-if="slots.footer">
                  <div
                    class="flex items-center justify-end gap-3 px-6 py-4 border-t sticky bottom-0 z-10 bg-white/90 dark:bg-[#141414]/90 backdrop-blur-md border-black/5 dark:border-white/5"
                  >
                    <slot name="footer"></slot>
                  </div>
                </template>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
/* Scoped styles removed in favor of utility classes to avoid @apply issues */
</style>
