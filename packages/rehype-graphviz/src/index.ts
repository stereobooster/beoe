// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import { rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";
import { RehypeGraphvizConfig, renderGraphviz } from "./render.js";

export const rehypeGraphviz = rehypeCodeHookImg<RehypeGraphvizConfig>({
  language: "dot",
  class: "graphviz",
  render: (code, options) => renderGraphviz({ ...options, code }),
});

export default rehypeGraphviz;
