import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { glob } from 'glob';
import path from 'node:path';

import blog from './rollup-plugin/rollup-plugin-blog-processor.ts'
import sitemap from './rollup-plugin/roller-plugin-sitemap-generator.ts'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const baseFilename = (file: string) => {
  return path.relative(
    'blogs',
    file.slice(0, file.length - path.extname(file).length)
  );
}

const blogs =
  Object.fromEntries(
    glob.sync(`${resolve(__dirname, 'blogs')}/**/*.md`).map(
      file => [ baseFilename(file), file ]
    )
  )

console.log(JSON.stringify(blogs, null, 2))

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
        // ...blogs,
        main: resolve(__dirname, 'index.html'),
      }
    }
  }
})
