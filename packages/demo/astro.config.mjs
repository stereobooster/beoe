import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { getCache } from "@datt/cache";
import { rehypeGraphviz } from "@datt/astro-graphviz/rehype";
import { rehypePintora } from "@datt/rehype-pintora";
import { rehypeMermaid } from "@datt/rehype-mermaid";
import { rehypeGnuplot } from "@datt/rehype-gnuplot";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      rehypeGraphviz,
      [
        // MDX:
        // without cache it renders 2927ms
        // with cache it renders 744ms
        // MD:
        // without cache it renders 1833ms
        // with cache it renders 104ms
        //
        // Conclusion: don't overuse MDX
        rehypePintora,
        { cache: getCache() },
      ],
      [rehypeMermaid, { cache: getCache() }],
      [rehypeGnuplot, { cache: getCache() }],
    ],
  },
});
