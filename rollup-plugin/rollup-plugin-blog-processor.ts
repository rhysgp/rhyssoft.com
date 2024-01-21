/*
 * Process the blog entries by converting them into HTML fragments that can
 * be loaded into the UI. We will also generate JSON that summarises the
 * available blog entries by their metadata.
 */


import { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';

const ext = /\.txt$/;

export default function processBlogs(options = {}): Plugin {

  const filter = createFilter([ '*.md', '**/*.md' ]);

  return {
    name: 'rs-blog-processor',

    transform(md, id) {
      if (!ext.test(id)) return null; // ignore files that don't have a .md ending
      console.log(`HERE! ${id} `);

      if (!filter(id)) return null; // hm; also filter files that don't end in .md and other stuff, depending on config

      console.log(`Transform called with id=${id}`);
      return JSON.stringify("hello blog file!");
    }
  }
};
