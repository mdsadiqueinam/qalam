<script setup>
import { PlusIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["create"]);
</script>

<template>
  <div
    class="group flex flex-col items-center justify-center aspect-3/4 border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
    @click="emit('create')"
  >
    <div
      class="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
    >
      <PlusIcon class="w-8 h-8" />
    </div>
    <span class="font-bold text-primary font-sans">Start New Book</span>
  </div>
</template>
