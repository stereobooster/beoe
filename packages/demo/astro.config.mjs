import { defineConfig } from "astro/config";
// import mdx from "@astrojs/mdx";
import rehypeGraphvizfrom from "@datt/rehype-graphviz";

// https://astro.build/config
export default defineConfig({
  // integrations: [mdx()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [rehypeGraphvizfrom],
  },
});
