import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import expressiveCode from "./expressiveCode.mjs";

import { getCache } from "@datt/cache";
import { rehypeGraphviz } from "@datt/astro-graphviz/rehype";
import { rehypePintora } from "@datt/rehype-pintora";
import { rehypeMermaid } from "@datt/rehype-mermaid";
import { rehypeGnuplot } from "@datt/rehype-gnuplot";
// import { rehypeStarryNight } from "@datt/rehype-starry-night";
import { rehypeColorChips } from "@datt/rehype-color-chips";

const cache = await getCache();

// https://astro.build/config
export default defineConfig({
  integrations: [
    expressiveCode,
    starlight({
      title: "DATT",
      social: {
        github: "https://github.com/stereobooster/datt",
      },
      sidebar: [
        {
          label: "Examples",
          autogenerate: { directory: "examples" },
        },
      ],
      customCss: ["./src/styles/custom.css"],
      components: {
        PageFrame: "./src/components/PageFrame.astro",
      },
    }),
  ],
  markdown: {
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
        { cache },
      ],
      [rehypeMermaid, { cache }],
      [rehypeGnuplot, { cache }],
      rehypeColorChips,
      // rehypeStarryNight,
    ],
  },
});
