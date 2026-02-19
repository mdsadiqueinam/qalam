<script setup>
import { ref } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import { CheckIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  items: Array,
})

defineEmits(['close'])

const defaultStatus = {}
for (const item of props.items) {
  defaultStatus[item.id] = false
}
const status = ref(defaultStatus)

const delay = 1200
const currentId = ref(null)
const timer = ref(null)

async function open(id) {
  if (currentId.value !== null && currentId.value !== id) {
    close(currentId.value)
  }

  if (timer.value !== null) {
    clearTimeout(timer.value)
    timer.value = null
  }

  currentId.value = id
  status.value[id] = true
}

function close(id) {
  currentId.value = null
  status.value[id] = false
}

function delayClose(id) {
  timer.value = setTimeout(() => {
    close(id)
  }, delay)
}
</script>

<template>
  <div
    class="min-h-8 min-w-[124px] items-center rounded-xl border border-divider-hover bg-main-unselected text-sm text-sidebar-text shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none"
  >
    <div class="flex w-[180px] flex-col gap-1 overflow-visible py-1 text-nav">
      <template v-for="item in items" :key="item.id">
        <template v-if="!item.children">
          <div v-if="item.label === '-'" class="block border-t border-divider-hover" />
          <component
            v-else
            :is="item.href ? 'a' : item.to ? 'RouterLink' : 'button'"
            :href="item.href"
            :to="item.to"
            class="group/menuItem mx-1 flex h-8 shrink-0 cursor-pointer items-center gap-3 text-nowrap rounded-lg px-2 text-main-text hover:bg-sidebar-selected hover:text-main-text-hover transition-colors duration-200"
            @click="item.onClick?.(() => $emit('close')) ?? $emit('close')"
          >
            <img
              v-if="item.image"
              :src="item.image"
              class="size-4 shrink-0 opacity-70 group-hover/menuItem:opacity-100 group-hover/menuItem:brightness-90 dark:group-hover/menuItem:brightness-125"
            />
            <component
              v-else-if="item.icon"
              :is="item.icon"
              class="size-4 shrink-0 opacity-70 group-hover/menuItem:opacity-100 group-hover/menuItem:brightness-90 dark:group-hover/menuItem:brightness-125"
            />
            <span class="grow overflow-hidden text-ellipsis text-left">
              {{ item.label }}
            </span>
            <CheckIcon v-if="item.isSelected" class="size-3 shrink-0" />
          </component>
        </template>

        <div v-else class="relative">
          <component
            :is="item.to ? 'RouterLink' : 'button'"
            :to="item.to"
            type="button"
            class="group/menuItem mx-1 flex h-8 cursor-pointer items-center gap-3 text-nowrap rounded-md px-2 text-main-text hover:bg-sidebar-selected hover:text-main-text-hover"
            @mouseenter="open(item.id)"
            @mouseleave="delayClose(item.id)"
          >
            <component
              v-if="item.icon"
              :is="item.icon"
              class="size-4 shrink-0 opacity-70 group-hover/menuItem:opacity-100 group-hover/menuItem:brightness-90 dark:group-hover/menuItem:brightness-125"
            />
            <span class="grow overflow-hidden text-ellipsis text-left">
              {{ item.label }}
            </span>
            <ChevronRightIcon class="size-2" />
          </component>

          <TransitionRoot
            as="template"
            :show="status[item.id]"
            enter="transition duration-200 ease-out"
            enter-from="scale-95 opacity-0"
            enter-to="scale-100 opacity-100"
            leave="transition duration-150 ease-in"
            leave-from="scale-100 opacity-100"
            leave-to="scale-95 opacity-0"
          >
            <div
              class="absolute left-full top-0 z-50 ml-2"
              @mouseenter="open(item.id)"
              @mouseleave="delayClose(item.id)"
            >
              <BaseNestedDropMenuPanel :items="item.children" @close="$emit('close')" />
            </div>
          </TransitionRoot>
        </div>
      </template>
    </div>
  </div>
</template>
