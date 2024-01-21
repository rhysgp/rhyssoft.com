<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
  <div class="flex h-screen justify-between flex-col">
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex flex-shrink-0 items-center">
              <img class="h-8 w-auto" src="/pyrrho.png" alt="Your Company">
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <!-- @todo Fix 'current' -->
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <router-view />

    <!-- Footer -->
    <footer class="flex items-center min-h-16 p-4 border-t border-gray-200">
      <span class="inline-block">Copyright &copy; 2023 Rhys Parsons. All rights reserved.</span>
    </footer>

  </div>
</template>
