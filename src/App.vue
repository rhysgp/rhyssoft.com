<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavLink from './components/NavLink.vue'
</script>
<template>
  <div class="flex justify-between flex-col">
    <nav class="bg-[#030303] text-[#fbfaf4]">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex flex-shrink-0 items-center">
              <img class="h-8 w-auto" src="/pyrrho.png" alt="Your Company">
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <NavLink page="" label="Home" />
                <NavLink page="about" label="About" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <router-view />

    <!-- Footer -->
    <footer class="flex items-center min-h-16 p-4 bg-[#030303] text-[#fbfaf4]">
      <span class="inline-block">Copyright &copy; 2023, 2024 Rhys Parsons. All rights reserved.</span>
    </footer>

  </div>
</template>
