<script setup lang="ts">
import moment from 'moment';

import type {BlogParagraph} from "@/blogs";

const props = defineProps<{
  blog: BlogParagraph[]
  index: number;
}>();

const formatDate = (s: string) => {
  return moment(s).format('LL');
}

</script>
<template>
  <router-link :to="'/blog/' + index">
    <div class="card">
      <div class="title">{{ blog[0].texts[0].text }}</div>
      <hr>
      <div class="intro">{{ blog[2].texts[0].text }}</div>
      <div class="date">{{ formatDate(blog[1].texts[0].text) }}</div>
    </div>
  </router-link>
</template>

<style scoped>
 .card {
   width: 500px;
   border: 1px solid #ddd;
   border-radius: 5px;
   margin-bottom: 10px;
   padding: 10px 20px;
 }

 .card hr {
   margin-bottom: 10px;
 }

 .title {
   font-weight: bold;
 }

 .date {
   width: 100%;
   text-align: end;
   color: grey;
   font-family: "Cutive Mono", monospace;
 }
</style>