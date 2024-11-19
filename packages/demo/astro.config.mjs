import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { qrcode } from "vite-plugin-qrcode";

import { getCache } from "@beoe/cache";
// can't deploy Playwright on netlify
// "@beoe/rehype-mermaid": "workspace:*",
// import { rehypeMermaid } from "@beoe/rehype-mermaid";
import { rehypeGraphviz } from "@beoe/rehype-graphviz";
import { rehypeGnuplot } from "@beoe/rehype-gnuplot";
import { rehypeVizdom } from "@beoe/rehype-vizdom";
import { rehypeD2 } from "@beoe/rehype-d2";

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
      [rehypeVizdom, { cache, class: className }],
      // [
      //   rehypeMermaid,
      //   { cache, class: className, strategy: "img-class-dark-mode" },
      // ],
      [rehypeGnuplot, { cache, class: className }],
      [rehypeD2, {}], //, { cache, class: className }],
    ],
  },
  vite: {
    plugins: [qrcode()],
  },
});
