<script setup>
import {
  FolderOpenIcon,
  ClockIcon,
  PencilSquareIcon,
  SparklesIcon,
} from "@heroicons/vue/24/outline";

// --- Props & models
defineProps({
  modelValue: {
    type: String,
    default: "all",
  },
});

const emit = defineEmits(["update:modelValue"]);

// --- Vars
const tabs = [
  { key: "all", label: "All Projects", icon: FolderOpenIcon },
  { key: "recent", label: "Recent", icon: ClockIcon },
  { key: "drafts", label: "Drafts", icon: PencilSquareIcon },
  { key: "published", label: "Published", icon: SparklesIcon },
];

// --- Handlers
function selectTab(key) {
  emit("update:modelValue", key);
}
</script>

<template>
  <div class="mb-8 border-b border-primary/10">
    <div class="flex gap-8 font-sans overflow-x-auto pb-px">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex items-center gap-2 border-b-2 py-3 px-1 text-sm font-medium whitespace-nowrap transition-colors"
        :class="
          modelValue === tab.key
            ? 'border-primary text-primary font-bold'
            : 'border-transparent text-main-text-muted hover:text-primary'
        "
        @click="selectTab(tab.key)"
      >
        <component :is="tab.icon" class="w-5 h-5" />
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
