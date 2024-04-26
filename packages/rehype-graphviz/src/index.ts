import type { Plugin } from "unified";
import type { Root } from "hast";
import { graphvizSvg } from "@datt/graphviz";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";

export type RehypeGraphvizConfig = {
  cache?: MapLike;
};

export const rehypeGraphviz: Plugin<[RehypeGraphvizConfig], Root> = (
  options
) => {
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    code: ({ language, code }) => {
      if (language !== "dot") return undefined;
      return graphvizSvg(code);
    },
  });
};

export default rehypeGraphviz;
