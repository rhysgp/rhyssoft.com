/*
 * Process the blog entries by converting them into HTML fragments that can
 * be loaded into the UI. We will also generate JSON that summarises the
 * available blog entries by their metadata.
 */


import { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { parseMarkdown } from "./markdown-parser";

const ext = /\.md$/;

export default function processBlogs(options = {}): Plugin {

  const filter = createFilter([ '*.md', '**/*.md' ]);

  return {
    name: 'rs-blog-processor',

    /*
     * See https://rollupjs.org/plugin-development/#transform
     */

    transform(md, id) {
      if (!ext.test(id)) {
        console.log(`Not processing: ${id}`);
        return null; // ignore files that don't have a .md ending
      }

      console.log(`Transform called with id=${id}`);

      const code = parseMarkdown(id, md);

      return {
        code: code,
        map: { mappings: '' }
    };
    }
  }
};
