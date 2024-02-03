<script setup lang="ts">
import Content from '../components/Content.vue'
import {type BlogParagraph, blogs} from '@/blogs'
import BlogCard from "@/components/BlogCard.vue";


const bs: BlogParagraph[][] = blogs();

</script>

<template>
  <Content>
    <BlogCard v-for="(b, i) in bs.reverse()" :blog="b" :index="bs.length -  i - 1 "/>
  </Content>
</template>

<style scoped>
</style>