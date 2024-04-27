import type { Plugin } from "unified";
import type { Root } from "hast";
import { graphvizSvg } from "./graphviz.js";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";

export { graphvizSvg };

export type RehypeGraphvizConfig = {
  cache?: MapLike;
};

export const rehypeGraphviz: Plugin<[RehypeGraphvizConfig?], Root> = (
  options = {}
) => {
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    language: "dot",
    code: ({ code }) => graphvizSvg(code),
  });
};

export default rehypeGraphviz;
