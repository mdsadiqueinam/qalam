<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <MainHeader />

    <main class="flex flex-1 overflow-hidden">
      <RouterView />
    </main>

    <MainFooter />
  </div>
</template>

<script setup>
// router-view is automatically available if using the router plugin
</script>

<style>
/* Global styles can go here */
</style>
