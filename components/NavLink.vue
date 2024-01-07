<script setup lang="ts">

const props = defineProps({
  page: { type: String, required: true },
  label: { type: String, required: true },
  current: Boolean
});

</script>

<template>
  <template v-if="current">
    <NuxtLink class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" :to="'/' + page" aria-current="page">{{label}}</NuxtLink>
  </template>
  <template v-else>
    <NuxtLink class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" :to="'/' + page">{{label}}</NuxtLink>
  </template>
</template>
