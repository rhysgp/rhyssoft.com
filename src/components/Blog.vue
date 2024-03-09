<script setup lang="ts">
import {onMounted} from "vue";
import {useRoute} from 'vue-router'
import {type BlogParagraph, blogs} from '@/blogs'
import BlogPara from "@/components/BlogPara.vue";
import Content from "@/components/Content.vue";


const props = defineProps<{
  id: number
}>();

const route = useRoute()

const blog: BlogParagraph[] = blogs()[Number(route.params.id)]

onMounted(() => {
  // @ts-ignore
  window.Prism.highlightAll();
});

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
</style>