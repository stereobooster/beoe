import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { qrcode } from "vite-plugin-qrcode";

import { getCache } from "@beoe/cache";
import { rehypeGraphviz } from "@beoe/rehype-graphviz";
import { rehypeMermaid } from "@beoe/rehype-mermaid";
import { rehypeGnuplot } from "@beoe/rehype-gnuplot";
import { rehypeVizdom } from "@beoe/rehype-vizdom";

const cache = await getCache();
// requerd for correct displaying mobile warning
const className = "not-content";

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
      [rehypeGraphviz, { cache, class: className }],
      [
        rehypeMermaid,
        { cache, class: className, strategy: "img-class-dark-mode" },
      ],
      [rehypeGnuplot, { cache, class: className }],
      [rehypeVizdom, { class: className, svgo: false, dataGraph: true }],
    ],
  },
  vite: {
    plugins: [qrcode()],
  },
});
