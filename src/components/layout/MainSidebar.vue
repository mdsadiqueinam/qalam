<script setup>
import {
  Squares2X2Icon,
  PencilSquareIcon,
  FolderOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";

// --- Props & models
defineProps({
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
    class="flex w-16 flex-col items-center border-r border-divider bg-sidebar py-6 gap-8 shrink-0"
  >
    <button
      class="group flex flex-col items-center gap-1 transition-colors"
      :class="
        activeSection === 'dashboard'
          ? 'text-primary'
          : 'text-sidebar-text hover:text-primary'
      "
      @click="handleNavigate('dashboard')"
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
      class="group flex flex-col items-center gap-1 transition-colors"
      :class="
        activeSection === 'editor'
          ? 'text-primary'
          : 'text-sidebar-text hover:text-primary'
      "
      @click="handleNavigate('editor')"
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
      class="group flex flex-col items-center gap-1 transition-colors"
      :class="
        activeSection === 'files'
          ? 'text-primary'
          : 'text-sidebar-text hover:text-primary'
      "
      @click="handleNavigate('files')"
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
      class="group flex flex-col items-center gap-1 transition-colors"
      :class="
        activeSection === 'analytics'
          ? 'text-primary'
          : 'text-sidebar-text hover:text-primary'
      "
      @click="handleNavigate('analytics')"
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
        class="group flex flex-col items-center gap-1 transition-colors"
        :class="
          activeSection === 'settings'
            ? 'text-primary'
            : 'text-sidebar-text hover:text-primary'
        "
        @click="handleNavigate('settings')"
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
