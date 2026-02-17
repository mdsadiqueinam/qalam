<script setup>
import {
  Squares2X2Icon,
  PencilSquareIcon,
  FolderOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/outline";

// --- Props & models
const props = defineProps({
  activeSection: {
    type: String,
    default: "editor",
  },
});

const emit = defineEmits(["navigate"]);

// --- Handlers
function handleNavigate(section) {
  emit("navigate", section);
}
</script>

<template>
  <aside
    class="flex w-16 flex-col items-center border-r border-primary/10 bg-white dark:bg-sidebar py-6 gap-8 shrink-0"
  >
    <button
      @click="handleNavigate('dashboard')"
      class="group flex flex-col items-center gap-1 transition-colors"
      :class="
        activeSection === 'dashboard'
          ? 'text-primary'
          : 'text-slate-400 dark:text-slate-500 hover:text-primary'
      "
    >
      <span
        class="p-2 rounded-xl transition-colors"
        :class="
          activeSection === 'dashboard'
            ? 'bg-primary/10'
            : 'group-hover:bg-primary/10'
        "
      >
        <Squares2X2Icon class="w-6 h-6" />
      </span>
    </button>

    <button
      @click="handleNavigate('editor')"
      class="group flex flex-col items-center gap-1 transition-colors"
      :class="
        activeSection === 'editor'
          ? 'text-primary'
          : 'text-slate-400 dark:text-slate-500 hover:text-primary'
      "
    >
      <span
        class="p-2 rounded-xl transition-colors"
        :class="
          activeSection === 'editor'
            ? 'bg-primary/10'
            : 'group-hover:bg-primary/10'
        "
      >
        <PencilSquareIcon class="w-6 h-6" />
      </span>
    </button>

    <button
      @click="handleNavigate('files')"
      class="group flex flex-col items-center gap-1 transition-colors"
      :class="
        activeSection === 'files'
          ? 'text-primary'
          : 'text-slate-400 dark:text-slate-500 hover:text-primary'
      "
    >
      <span
        class="p-2 rounded-xl transition-colors"
        :class="
          activeSection === 'files'
            ? 'bg-primary/10'
            : 'group-hover:bg-primary/10'
        "
      >
        <FolderOpenIcon class="w-6 h-6" />
      </span>
    </button>

    <button
      @click="handleNavigate('analytics')"
      class="group flex flex-col items-center gap-1 transition-colors"
      :class="
        activeSection === 'analytics'
          ? 'text-primary'
          : 'text-slate-400 dark:text-slate-500 hover:text-primary'
      "
    >
      <span
        class="p-2 rounded-xl transition-colors"
        :class="
          activeSection === 'analytics'
            ? 'bg-primary/10'
            : 'group-hover:bg-primary/10'
        "
      >
        <ChartBarIcon class="w-6 h-6" />
      </span>
    </button>

    <div class="mt-auto">
      <button
        @click="handleNavigate('settings')"
        class="group flex flex-col items-center gap-1 transition-colors"
        :class="
          activeSection === 'settings'
            ? 'text-primary'
            : 'text-slate-400 dark:text-slate-500 hover:text-primary'
        "
      >
        <span
          class="p-2 rounded-xl transition-colors"
          :class="
            activeSection === 'settings'
              ? 'bg-primary/10'
              : 'group-hover:bg-primary/10'
          "
        >
          <Cog6ToothIcon class="w-6 h-6" />
        </span>
      </button>
    </div>
  </aside>
</template>
