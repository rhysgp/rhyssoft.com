<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    required: true,
    validator(value: number, _props: any): boolean {
      return Number.isInteger(value) && value >= 1 && value <= 6;
    }
  }
});
</script>
<template>
  <h1      v-if="size==1" class="text-4xl border-b-2 border-gray-400 mb-4"><slot/></h1>
  <h1 v-else-if="size==2" class="text-3xl            "><slot/></h1>
  <h1 v-else-if="size==3" class="text-2xl            "><slot/></h1>
  <h1 v-else-if="size==4" class="text-xl             "><slot/></h1>
  <h1 v-else-if="size==5" class="text-lg             "><slot/></h1>
  <h1 v-else-if="size==6" class="text-base  font-bold"><slot/></h1>
</template>
