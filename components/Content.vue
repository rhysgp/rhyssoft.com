<script setup lang="ts">

const props = defineProps({
  page: { type: String, required: true },
  label: { type: String, required: true },
  current: Boolean
});

</script>

<template>
  <div class="mx-auto max-w-2xl pt-2">
    <slot/>
  </div>
</template>
