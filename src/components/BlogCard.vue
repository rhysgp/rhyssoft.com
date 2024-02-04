<script setup lang="ts">
import { formatDate } from '@/utils/date-format'

import type {BlogParagraph} from "@/blogs";

const props = defineProps<{
  blog: BlogParagraph[]
  index: number;
}>();

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
   color: #2c4429;
   background-color: #cbdec9;

   width: 500px;
   border: 1px solid #6da268;
   border-radius: 5px;
   margin-bottom: 10px;
   padding: 10px 20px;
 }

 .card hr {
   margin-bottom: 10px;
   background-color: #6da268;
   color: #6da268;
   height: 2px;
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