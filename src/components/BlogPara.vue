<script setup lang="ts">

import type {BlogParagraph, BlogSpan} from "@/blogs";

const props = defineProps<{
  para: BlogParagraph;
}>();

</script>
<template>
  <p :class="'blog_para_' + para.style">
    <template v-for="t in para.texts">
      <span :class="'blog_span_' + t.style">{{t.text}}</span>
    </template>
  </p>
  <hr v-if="para.style === 1">
</template>
<style scoped>
p {
  font-size: 14pt;
}

.blog_para_0 {
  margin-bottom: 10px;
}
.blog_para_1 {
  font-weight: bold;
  font-size: 18pt;
}
.blog_para_1 + hr {
  margin-bottom: 10px;
}

</style>