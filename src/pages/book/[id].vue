<script setup>
import { useRoute } from "vue-router";
import LibraryBookPageId from "@components/library/LibraryBookPageId.vue";

const route = useRoute();
</script>

<template>
  <LibraryBookPageId :id="route.params.id" />
</template>
