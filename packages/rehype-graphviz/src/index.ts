import type { Plugin } from "unified";
import type { Root } from "hast";
import { processGraphvizSvg } from "./graphviz.js";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";

// import { Graphviz } from "@hpcc-js/wasm";
// const graphviz = await Graphviz.load();
// export const renderGraphviz = ({ code }: { code: string }) =>
//   processGraphvizSvg(graphviz.dot(code));

import { waitFor } from "@datt/rehype-code-hook";
/**
 * If all graphviz diagrams are cached it would not even load module in memory.
 * If there are diagrams, it would load module and first few renders would be async,
 * but all consequent renders would be sync
 */
export const renderGraphviz = waitFor(
  async () => {
    // @ts-ignore
    const Graphviz = (await import("@hpcc-js/wasm")).Graphviz;
    return await Graphviz.load();
  },
  (graphviz) =>
    ({ code }: { code: string }) =>
      processGraphvizSvg(graphviz.dot(code))
);

export { processGraphvizSvg };

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
    code: renderGraphviz,
  });
};

export default rehypeGraphviz;
