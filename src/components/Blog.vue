<script setup lang="ts">
import { useRoute } from 'vue-router'
import {type BlogParagraph, blogs} from '@/blogs'
import BlogPara from "@/components/BlogPara.vue";
import Content from "@/components/Content.vue";


const props = defineProps<{
  id: number
}>();

const route = useRoute()

const blog: BlogParagraph[] = blogs()[Number(route.params.id)]

</script>

<template>
  <Content>
    <template v-for="(para, i) in blog">
      <BlogPara :para="para" :published-date="i === 1"/>
    </template>
  </Content>
</template>

<style scoped>
</style>