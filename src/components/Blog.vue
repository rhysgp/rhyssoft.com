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
    <div class="blog">
      <template v-for="(para, i) in blog">
        <BlogPara :para="para" :published-date="i === 1"/>
      </template>
    </div>
  </Content>
</template>

<style scoped>
  .blog {
    border: 3px solid #030303;
    border-radius: 5px;
    padding: 10px 20px;
    margin-bottom: 5px;
  }
</style>