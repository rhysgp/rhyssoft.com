import {Plugin} from "rollup";
import {glob} from "glob";
import path from "node:path";

interface GenerateSitemapOptions {
  staticFiles: string[];
  blogDirectory: string;
}

const baseFilename = (file: string): string => {
  const p = path.parse(file);
  return p.name;
};

const fileToSitemapLoc = (file: string): string => {
    return `  <url>
    <loc>${baseFilename(file)}</loc>
  </url>`;
};

export default function generateSitemap(
    options: GenerateSitemapOptions = {
        staticFiles: [], blogDirectory: 'blogs'
    }
): Plugin {

  console.log(`blog directory: ${options.blogDirectory}`);

  const blogEntries =
    glob.sync(`${options.blogDirectory}/**/*.md`).map(
      file => fileToSitemapLoc(file)
    )

  const andAlso = options.staticFiles.map(
    file => fileToSitemapLoc(file)
  )

  const entries = [
    ...blogEntries,
    ...andAlso
  ];

  return {
    name: "sitemap",
    generateBundle() {
      this.emitFile({
        type: "asset",
        name: "sitemap.xml",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`
      });
    }
  };
};
