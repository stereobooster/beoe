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
  strategy: "file",
  darkScheme: "class",
  // do not use .beoe for Netlify deployments
  fsPath: "public/beoe",
  webPath: "/beoe",
};

const rehypePlugins = [
  [rehypeGraphviz, { cache, class: className }],
  [rehypeVizdom, { cache, class: className }],
  [rehypeMermaid, conf],
  [rehypeGnuplot, conf],
  [rehypeD2, { ...conf, shared: "shared/**/*.d2" }],
];
// this breaks build
// this breaks http://localhost:4321/examples/d2-test/
// if (import.meta.env.DEV) {
//   const { rehypePenrose } = await import("@beoe/rehype-penrose");
//   rehypePlugins.push([
//     rehypePenrose,
//     { ...conf, shared: "shared", svgo: false },
//   ]);
// }

const sidebar = [
  {
    label: "Start here",
    autogenerate: { directory: "start-here" },
  },
  {
    label: "Diagrams",
    autogenerate: { directory: "diagrams" },
  },
  {
    label: "Other",
    autogenerate: { directory: "other" },
  },
  {
    label: "Notes",
    autogenerate: { directory: "notes" },
  },
];
if (import.meta.env.DEV) {
  sidebar.push({
    label: "Examples",
    autogenerate: { directory: "examples" },
  });
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "BEOE",
      social: {
        github: "https://github.com/stereobooster/beoe",
      },
      sidebar,
      customCss: ["./src/styles/custom.css"],
      components: {
        PageFrame: "./src/components/PageFrame.astro",
      },
    }),
  ],
  markdown: {
    rehypePlugins,
  },
  vite: {
    plugins: [qrcode()],
  },
});
