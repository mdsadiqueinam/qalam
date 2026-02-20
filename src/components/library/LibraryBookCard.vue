<script setup>
import { EllipsisVerticalIcon, BookOpenIcon } from "@heroicons/vue/24/outline";
import BaseButton from "@shared/components/BaseButton.vue";

// --- Props & models
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

function openBook() {
  router.push(`/book/${props.book.id}`);
}

function editBook() {
  router.push(`/book/${props.book.id}/edit`);
}
</script>

<template>
  <div
    class="group flex flex-col bg-sidebar rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-border-subtle hover:border-primary/20 cursor-pointer"
    @click="openBook"
  >
    <div class="relative aspect-3/4 overflow-hidden">
      <!-- Hover overlay -->
      <div
        class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
      >
        <BaseButton class="w-full" size="md" @click.stop="editBook">
          Edit Manuscript
        </BaseButton>
      </div>

      <!-- Cover image or Placeholder -->
      <img
        v-if="book.coverImage"
        :alt="book.title"
        :src="book.coverImage"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-primary/5 text-primary/30 transition-transform duration-500 group-hover:scale-105"
      >
        <BookOpenIcon class="w-16 h-16" />
      </div>

      <!-- Three-dot menu -->
      <div class="absolute top-2 right-2 z-20">
        <BaseButton
          iconOnly
          variant="transparent"
          class="bg-white/80! hover:bg-white!"
        >
          <template #icon>
            <EllipsisVerticalIcon class="w-5 h-5 text-main-text" />
          </template>
        </BaseButton>
      </div>
    </div>

    <div class="p-4">
      <h3
        class="font-bold text-main-text leading-tight font-display mb-1 truncate"
      >
        {{ book.title }}
      </h3>
      <p class="text-xs text-main-text-muted font-sans cursor-pointer">
        {{ book.editedAt }}
      </p>
    </div>
  </div>
</template>
