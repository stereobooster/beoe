import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { qrcode } from "vite-plugin-qrcode";

import { getCache } from "@beoe/cache";
import { rehypeMermaid } from "@beoe/rehype-mermaid";
import { rehypeGraphviz } from "@beoe/rehype-graphviz";
import { rehypeGnuplot } from "@beoe/rehype-gnuplot";
import { rehypeVizdom } from "@beoe/rehype-vizdom";
import { rehypeD2 } from "@beoe/rehype-d2";

const cache = await getCache();
// requerd for correct displaying mobile warning
const className = "not-content";
const conf = {
  cache,
  strategy: "img-class-dark-mode",
  fsPath: "public/.beoe",
  webPath: "/.beoe",
};

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
        {
          label: "Notes",
          autogenerate: { directory: "notes" },
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
      [rehypeVizdom, { cache, class: className }],
      [rehypeMermaid, conf],
      [rehypeGnuplot, { ...conf, strategy: "img" }],
      [rehypeD2, conf],
    ],
  },
  vite: {
    plugins: [qrcode()],
  },
});
