<script setup>
import { useDebounceFn } from "@vueuse/core";
import { db } from "@root/db/index";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const book = useDexieLiveQueryWithDeps([() => props.id], async () => {
  return await db.books.get(props.id);
});

const debouncedSave = useDebounceFn(async () => {
  if (!book.value) return;
  book.value.save();
}, 1000);

watch(
  book,
  () => {
    debouncedSave();
  },
  { deep: true },
);
</script>

<template>
  <div class="flex w-full flex-col bg-main text-main-text">
    <div v-if="!book">Loading...</div>
    <StudioEditor v-else v-model="book.content" class="flex-1" />
  </div>
</template>
