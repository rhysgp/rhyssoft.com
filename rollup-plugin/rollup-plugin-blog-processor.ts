/*
 * Process the blog entries by converting them into HTML fragments that can
 * be loaded into the UI. We will also generate JSON that summarises the
 * available blog entries by their metadata.
 */


import { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { parseMarkdown } from "./markdown-parser";
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import {resolve} from "path";


export default function processBlogs(options = {}): Plugin {

  return {
    name: 'rs-blog-processor',

    /*
     * See https://rollupjs.org/plugin-development/#transform
     */

    async transform(content, id) {

      /*
       * @todo write a route to router/index.ts
       *       (I wonder if I can pass the JSON straight into the route entry)
       */

      if (id.endsWith('/src/blogs.ts')) {
        // process the blogs...

        const blogsDir = path.resolve(id, '../../blogs/')

        console.log(`\nblogsDir = ${blogsDir}`);

        const files = await readdir(blogsDir);
        for (const file of files) {
          const fullPath = resolve(blogsDir, file)
          // read the contents of the file:
          console.log(fullPath);
          const md = await readFile(fullPath, 'utf-8');
          const paragraphs = parseMarkdown(id, md);
          const blogJson = JSON.stringify(paragraphs);
          content = content.replace(/\/\* add blogs here \*\//, blogJson + ',\n/* add blogs here */');
        }

        console.log(content);

        return {
          code: content,
          map: { mappings: '' }
        };
      }
    }
  }
};
