// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import {
  createMermaidRenderer,
  MermaidRenderer,
  type CreateMermaidRendererOptions,
  type RenderOptions,
} from "mermaid-isomorphic";
import { BaseOptions, rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";

import { type Config as SvgoConfig } from "svgo";

const svgo: SvgoConfig = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // we need viewbox for inline SVGs
          removeViewBox: false,
          // this breaks statediagram
          convertShapeToPath: false,
        },
      },
    },
  ],
};

export type RehypeMermaidConfig = RenderOptions & CreateMermaidRendererOptions;

let renderDiagrams: MermaidRenderer;

async function render(
  code: string,
  options: RehypeMermaidConfig & BaseOptions
) {
  const { css, mermaidConfig, prefix, browserType, launchOptions, darkMode } =
    options;
  const createOptions = { browserType, launchOptions };
  const renerOptions = { css, mermaidConfig: mermaidConfig || {}, prefix };

  if (!renderDiagrams) renderDiagrams = createMermaidRenderer(createOptions);

  // otherwise all diagrams would have same ID and styles would collide
  renerOptions.prefix = `m${Math.random().toString().replace(".", "")}`;
  const [x] = await renderDiagrams([code], renerOptions);
  if (x.status !== "fulfilled") throw new Error(x.reason);
  const { svg, width, height, title: alt } = x.value;
  // there is also x.value.description

  let darkSvg: string | undefined;
  if (darkMode) {
    renerOptions.mermaidConfig.theme = "dark";
    renerOptions.prefix = `m${Math.random().toString().replace(".", "")}`;
    const [x] = await renderDiagrams([code], renerOptions);
    if (x.status !== "fulfilled") throw new Error(x.reason);
    darkSvg = x.value.svg;
  }

  return { svg, darkSvg, width, height, alt };
}

export const rehypeMermaid = rehypeCodeHookImg<RehypeMermaidConfig>({
  language: "mermaid",
  render,
  svgo,
});

export default rehypeMermaid;
