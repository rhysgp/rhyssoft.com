# A Rollup Plugin
2024-03-06

A little about my journey in writing a Rollup plugin, why I wanted to do it in
the first place, and two brief digressions.

I decided I wanted to be able to write my blog entries as markdown files, and
to keep those files in git. This gives me an automatic history of blog updates,
and will enable me to automatically write publish and edit dates, when I get
around to it.

I didn't want to use blogspot, or any other blog-hosting provider, because I
wanted the freedom to create the exact website I wanted. I also wanted to host
the blog using my own domain name. And, after all, it gives me something to
blog about.

I have been using VueJS a fair amount recently, a web framework I'm therefore
familiar with. I took a look at using Nuxt, which let's you create a static 
website from dynamic code. That was my first cut (which you can see in my 
[git history](https://github.com/rhysgp/rhyssoft.com)). I liked Nuxt, 
but I couldn't see how to add a Rollup plugin, so I reverted to using VueJS.

I wanted to create a Rollup plugin to display my blog entries as part of the 
vite build. [Vite](https://vitejs.dev/) is a tool for frontend development, 
which I use for developing VueJS apps. Under the bonnet, vite uses 
[Rollup](https://rollupjs.org/), a module bundler. A bundler takes the different
elements that make up a frontend webapp (HTML, JavaScript, HTML) and creates
efficient HTML, JavaScript and CSS files. Bundlers have revolutionised the
way we think about writing dynamic websites. JavaScript for the server (Node JS)
has helped define a rich ecosystem of JavaScript libraries, and both libraries 
and tooling for JavaScript-based applications, whether frontend or backend, have 
mushroomed.

JavaScript has its downsides. It has some unusual inheritance behaviour that 
is not intuitive for someone coming from a Java background; and it is not 
statically typed. (I know you probably know this: I'm just filling in some gaps!).
A version of EcmaScript was proposed that introduces strong typing, but it wasn't 
popular with web developers, who liked the Wild West weak typing of JavaScript. 
ActionScript (created by Adobe for developing Flex applications targeting their
now defunct Flash plugin) was based on this typed version of JavaScript. I used
it successfully on a project about 15 years ago. In some ways, many of the 
recent frontend frameworks (React, VueJS), when used in conjunction with
TypeScript, are imitations of Flex and ActionScript.

So, anyway, I figured I would write a plugin for Rollup to convert my Markdown 
blogs into JSON. Both Rollup and VueJS like JSON. It's a native data format for 
JavaScript-based environments. It's largely overtaken XML as the general purpose
data format of choice, which I think is broadly a good thing.

To digress again, in the 90s and 00s, the focus was very much on using types and
service descriptors to support interoperability between different systems. The
idea was, in part, that you would not need to know in advance what a network-enabled
interface was: you could ask it, and it would tell you. Microsoft's Component
Object Model had similar features, and CORBA had discoverability across 
heterogeneous networks as a core design principle. Service Oriented Architecture
was based on XML and service descriptors. But, in the end, the lighter-weight
protocols have proved their worth. Maybe that's in part because, as a developer,
you need to know what a service you're calling does in advance, or why would you
call it? and in part because of the overhead of writing clients for these services,
even when that is automated. REST APIs and JSON payloads have just made everything
a lot easier.

Back to Rollup. It took me a little playing around to get something to work
they way I wanted it to. The examples I saw were mostly about modifying things, 
not about transforming one format to another. I did get that transformation to 
work, but I ended up with JavaScript files (one for each blog entry) that I couldn't
then dynamically load (because I'd need to be able to query which JSON files
were available, and I didn't want any backend logic). The answer was straightforward.
I wrote a simple TypeScript class that would hold an array of the blog entries:

```TypeScript

export interface BlogSpan {
    style: any;
    text: string;
}

export interface BlogParagraph {
    style: any;
    texts: BlogSpan[]
}

export function blogs(): BlogParagraph[][] {

    return [
        /* add blogs here */
    ];

}
```

My Rollup plugin then modifies this by loading the Markdown files from the `blogs/`
directory, transforming them to JSON and inserting them at the `/* add blogs here */`
comment. No doubt I could make this more robust, and if this wasn't just my
own project, I would.

The plugin itself is, then, mostly boilerplate:
```TypeScript
import { Plugin } from 'rollup';
import { parseMarkdown } from "./markdown-parser";
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import {resolve} from "path";

export default function processBlogs(options = {}): Plugin {
    return {
        name: 'rs-blog-processor',
        async transform(content, id) {
            if (id.endsWith('/src/blogs.ts')) {
                const blogsDir = path.resolve(id, '../../blogs/')
                const files = await readdir(blogsDir);
                for (const file of files.sort()) {
                    const fullPath = resolve(blogsDir, file)
                    const md = await readFile(fullPath, 'utf-8');
                    const paragraphs = parseMarkdown(id, md);
                    const blogJson = JSON.stringify(paragraphs);
                    content = content.replace(/\/\* add blogs here \*\//, blogJson + ',\n/* add blogs here */');
                }
                return {
                    code: content,
                    map: { mappings: '' }
                };
            }
        }
    }
};
```

To install the plugin from the filesystem:
```bash
npm i  rollup-plugin/ --save-dev
```

This creates a link to where the plugin is on the filesystem, so no need
to re-install when I make changes to the plugin.

Then, this is included in the Vite configuration (_vite.config.ts_):
```TypeScript
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import blog from './rollup-plugin/rollup-plugin-blog-processor.ts'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        blog(),
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
```

Building the app:
```bash
npm run build
```
creates the output we want. It's in the `dist/assets/main-48uhkpzz.js` (in my
latest dev build - the base filename after the hyphen is randomly generated, 
presumably so that cached versions aren't used when a new version of the app
is deployed), so it's folded in with the rest of the JavaScript, including that
needed for Vue. It is findable in a text editor, though, if you search for
_add blogs here_!

My Markdown parsing is currently incomplete, so depending on when you're viewing
this, some of the inline styles (links) and block styles (code blocks) won't 
display properly. I will work to fix these over the coming weeks. Currently, the
website is more dynamic than I'd like. I want static HTML pages to be generated,
and I will work on that, too over the coming weeks. I'll blog about how it goes.
