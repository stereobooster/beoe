import type { Plugin } from "unified";
import type { Root } from "hast";
import { Graphviz } from "@hpcc-js/wasm";
import { rehypeCodeHook } from "@datt/rehype-code-hook";

const graphviz = await Graphviz.load();

export const rehypeGraphviz: Plugin<[{}], Root> = () => {
  // @ts-expect-error
  return rehypeCodeHook({
    code: ({ language, code }) => {
      if (language !== "dot") return undefined;
      return graphviz.dot(code).split("\n").slice(6).join("\n")
    },
  });
};

export default rehypeGraphviz;
