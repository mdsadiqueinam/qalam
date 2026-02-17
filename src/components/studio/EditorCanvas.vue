<script setup>
// --- Props & models
const modelValue = defineModel({ type: String, default: "" });
</script>

<template>
  <div class="flex-1 overflow-y-auto p-12">
    <textarea
      v-model="modelValue"
      class="rtl-editor font-serif h-full w-full resize-none border-none p-0 text-2xl leading-relaxed text-main-text placeholder:text-main-text-muted focus:ring-0 bg-transparent"
      placeholder="ابدأ الكتابة بالعربية..."
    />
  </div>
</template>

<style scoped>
.rtl-editor {
  direction: rtl;
  text-align: right;
}
</style>
