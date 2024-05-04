import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import { getCache } from "@beoe/cache";
import { rehypeGraphviz } from "@beoe/astro-graphviz/rehype";
import { rehypeMermaid } from "@beoe/rehype-mermaid";
import { rehypeGnuplot } from "@beoe/rehype-gnuplot";

const cache = await getCache();
const className = undefined; // "not-content"

// https://astro.build/config
export default defineConfig({
  integrations: [
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
        rehypeMermaid,
        { cache, class: className, strategy: "class-dark-mode" },
      ],
      [rehypeGnuplot, { cache, class: className }],
    ],
  },
});
