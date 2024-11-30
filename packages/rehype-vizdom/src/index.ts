// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import { rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";
import { render, RehypeVizdomConfig } from "./render.js";

export const rehypeVizdom = rehypeCodeHookImg<RehypeVizdomConfig>({
  language: "vizdom",
  render,
});

export default rehypeVizdom;
