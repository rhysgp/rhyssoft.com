<script setup lang="ts">
import type {BlogParagraph, BlogSpan} from "@/blogs";
import { formatDate } from '@/utils/date-format'

const props = defineProps<{
  para: BlogParagraph;
  publishedDate: boolean;
}>();

</script>
<template>
  <pre v-if="para.style === 9"><code :class="'language-' + para.type">{{para.texts[0].text}}</code></pre>
  <p v-else :class="'blog_para_' + para.style">
    <template v-if="publishedDate">
      <div class="w-full text-right text-gray-500 font-cutive-mono">{{formatDate(para.texts[0].text)}}</div>
    </template>
    <template v-else v-for="t in para.texts">
      <a v-if="t.style === 4" :href="t.href">{{t.text}}</a>
      <code v-else-if="t.style === 5">{{t.text}}</code>
      <span v-else :class="'blog_span_' + t.style">{{t.text}}</span>
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
  color: var(--color-text-highlight);
}
.blog_para_1 + hr {
  margin-bottom: 10px;
}
.blog_para_2 {
  color: var(--color-text-highlight);
}
</style>