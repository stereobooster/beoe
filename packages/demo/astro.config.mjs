import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { rehypeGraphviz } from "@datt/astro-graphviz/rehype";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [rehypeGraphviz],
  },
});
