import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import blog from './rollup-plugin/rollup-plugin-blog-processor.ts'
//import sitemap from './rollup-plugin/roller-plugin-sitemap-generator.ts'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    blog(),
//    sitemap({
//      staticFiles: [
//        '/about.html'
//      ],
//      blogDirectory: resolve(__dirname, 'blogs')
//    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  }
})
