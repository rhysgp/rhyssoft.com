<script setup lang="ts">

import type {BlogSpan} from "@/blogs";

const props = defineProps<{
  style: number,
  texts: BlogSpan[]
}>();

</script>
<template>
  <p :class="'blog_para_' + style">
    <template v-for="t in texts">
      <span :class="'blog_span_' + t.style">{{t.text}}</span>
    </template>
  </p>
</template>
<style scoped>
</style>