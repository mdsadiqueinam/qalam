<script setup>
import { computed } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useWindowSize } from "@vueuse/core";

// --- Use ---
const { width: screenWidth } = useWindowSize();

// --- Props & models ---
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    default: "true",
  },
  nameAlign: {
    type: String,
    default: "left",
  },
  onSubmit: {
    type: [Function, null],
    default: null,
  },
});

const modelValue = defineModel({
  type: Boolean,
  default: false,
});

// --- Emits ---
const emit = defineEmits(["close", "submit"]);

// --- Handlers ---
function close() {
  emit("close");
  modelValue.value = false;
}

function submit() {
  emit("submit");
}

// --- Watchers & computed ---
const isSmallScreen = computed(() => screenWidth.value < 768);
</script>

<template>
  <TransitionRoot :show="show" appear as="template">
    <Dialog as="div" class="relative z-50" @close="close">
      <TransitionChild
        as="template"
        enter="transition-opacity duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 backdrop-blur-sm"
          :class="{
            'bg-main/30': !isSmallScreen,
            'bg-main/50': isSmallScreen,
          }"
        />
      </TransitionChild>

      <div
        class="fixed left-1/2 -translate-x-1/2 overflow-y-auto"
        :class="{
          'top-10': !isSmallScreen,
          'top-10 w-[calc(100%-30px)]': isSmallScreen,
        }"
      >
        <div
          class="animate-fade-in flex min-h-full items-center justify-center"
        >
          <DialogPanel
            class="animate-fadeIn transform border border-divider bg-main align-middle shadow-xl ring-1 ring-black/5 transition-all"
            :class="{
              'min-w-[300px] rounded-xl': !isSmallScreen,
              'w-full rounded-t-xl': isSmallScreen,
            }"
          >
            <form @submit.prevent="props.onSubmit">
              <!-- Submit needed here to prevent 'Form submission canceled because the form is not connected' -->
              <button type="submit" class="hidden" />
              <header
                class="flex h-14 items-center border-b border-divider"
                :class="{
                  'pl-5': nameAlign === 'left',
                  'items-center justify-center': nameAlign === 'center',
                }"
              >
                <slot name="header">
                  <slot name="beforeTitle" />
                  <span
                    v-if="name"
                    class="flex h-full items-center justify-center text-lg font-semibold"
                    v-html="name"
                  />
                  <slot name="afterTitle" />
                </slot>

                <button
                  class="ml-auto mr-3 flex rounded-full p-1 transition-[border,background-color,color,opacity] duration-300 hover:bg-main-unselected-hover hover:text-main-text-hover focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                  @click.prevent="close"
                >
                  <XMarkIcon class="size-5" />
                </button>
              </header>
              <div class="max-h-[calc(100vh-200px)] overflow-y-auto">
                <slot name="contentNoPadding">
                  <div
                    class="max-h-[calc(100vh-200px)] overflow-hidden overflow-y-auto px-4 py-3"
                  >
                    <slot />
                  </div>
                </slot>
              </div>
              <div
                v-if="$slots.footer"
                class="flex justify-end gap-3 border-t border-divider p-4"
              >
                <slot name="footer" />
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
