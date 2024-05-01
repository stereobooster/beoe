import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import expressiveCode from "./expressiveCode.mjs";

import { getCache } from "@beoe/cache";
import { rehypeGraphviz } from "@beoe/astro-graphviz/rehype";
import { rehypePintora } from "@beoe/rehype-pintora";
import { rehypeMermaid } from "@beoe/rehype-mermaid";
import { rehypeGnuplot } from "@beoe/rehype-gnuplot";
// import { rehypeStarryNight } from "@beoe/rehype-starry-night";
// import { rehypeColorChips } from "@beoe/rehype-color-chips";

const cache = await getCache();
const className = undefined; // "not-content"

// https://astro.build/config
export default defineConfig({
  integrations: [
    expressiveCode,
    starlight({
      title: "BEOE",
      social: {
        github: "https://github.com/stereobooster/beoe",
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
      [rehypeGraphviz, { class: className }],
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
        { cache, class: className },
      ],
      [rehypeMermaid, { cache, class: className }],
      [rehypeGnuplot, { cache, class: className }],
      // either tests fail or demo fails
      // rehypeColorChips,
      // rehypeStarryNight,
    ],
  },
});
