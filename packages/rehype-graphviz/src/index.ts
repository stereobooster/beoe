import type { Plugin } from "unified";
import type { Root } from "hast";
import { Graphviz } from "@hpcc-js/wasm";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";
import { minify } from "html-minifier";

const graphviz = await Graphviz.load();

const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
};

export const graphvizSvg = (code: string) =>
  minify(graphviz.dot(code).split("\n").slice(6).join("\n"), minifyOptions);

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
