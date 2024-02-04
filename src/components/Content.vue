<script setup lang="ts">

</script>

<template>
  <div class="mx-auto max-w-2xl pt-2 content-panel">
    <slot/>
  </div>
</template>

<style scoped>
  .content-panel {
    min-height: calc(100vh - 64px - 64px);
  }

</style>