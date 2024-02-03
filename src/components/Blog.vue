<script setup lang="ts">
import { useRoute } from 'vue-router'
import {type BlogParagraph, blogs} from '@/blogs'
import BlogPara from "@/components/BlogPara.vue";


const props = defineProps<{
  id: number
}>();


const route = useRoute()

const blog: BlogParagraph[] = blogs()[Number(route.params.id)]


</script>

<template>
  <template v-for="para in blog">
    <BlogPara :style="para.style" :texts="para.texts" />
  </template>
</template>

<style scoped>
.content-panel { min-height: calc(100% - 64px - 64px) }
</style>