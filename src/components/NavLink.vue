<script setup lang="ts">

import { useRoute } from 'vue-router';
import {computed} from "vue";

const route = useRoute();

const props = defineProps({
  page: { type: String, required: true },
  label: { type: String, required: true },
  current: Boolean
});

const path = computed(() => { return "/" + props.page });

</script>

<template>
  <template v-if="route.path == path">
    <RouterLink class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" :to="path" aria-current="page">{{label}}</RouterLink>
  </template>
  <template v-else>
    <RouterLink class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" :to="path">{{label}}</RouterLink>
  </template>
</template>
