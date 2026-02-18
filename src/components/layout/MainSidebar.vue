<script setup>
import {
  Squares2X2Icon,
  PencilSquareIcon,
  FolderOpenIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";

// --- Props & models

const routes = [
  {
    label: "Dashboard",
    icon: Squares2X2Icon,
    to: "/",
  },
  {
    label: "Editor",
    icon: PencilSquareIcon,
    to: "/studio",
  },
  {
    label: "Files",
    icon: FolderOpenIcon,
    to: "/files",
  },
];

const settingsRoute = {
  label: "Settings",
  icon: Cog6ToothIcon,
  to: "/settings",
};

// --- Handlers
</script>

<template>
  <aside
    class="flex w-16 flex-col items-center border-r border-divider bg-sidebar py-6 gap-8 shrink-0"
  >
    <RouterLink
      v-for="route in routes"
      :key="route.to"
      :to="route.to"
      class="group flex flex-col items-center gap-1 transition-colors text-sidebar-text hover:text-primary rounded-xl"
      activeClass="!text-primary bg-primary/10"
    >
      <span class="p-2 rounded-xl transition-colors group-hover:bg-primary/10">
        <component :is="route.icon" class="w-6 h-6" />
      </span>
    </RouterLink>

    <div class="mt-auto">
      <RouterLink
        :to="settingsRoute.to"
        class="group flex flex-col items-center gap-1 transition-colors text-sidebar-text hover:text-primary"
        activeClass="!text-primary"
      >
        <span
          class="p-2 rounded-xl transition-colors group-[.router-link-active]:bg-primary/10 group-hover:bg-primary/10"
        >
          <component :is="settingsRoute.icon" class="w-6 h-6" />
        </span>
      </RouterLink>
    </div>
  </aside>
</template>
