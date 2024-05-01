import type { Plugin } from "unified";
import type { Root } from "hast";
import { processGraphvizSvg } from "./graphviz.js";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";

// import { Graphviz } from "@hpcc-js/wasm";
// const graphviz = await Graphviz.load();
// export const renderGraphviz = ({ code }: { code: string }) =>
//   processGraphvizSvg(graphviz.dot(code));

import { waitFor } from "@datt/rehype-code-hook";

export type RenderGraphvizOptions = { code: string; class?: string };

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
  (graphviz) => (o: RenderGraphvizOptions) =>
    processGraphvizSvg(graphviz.dot(o.code), o.class)
);

export { processGraphvizSvg };

export type RehypeGraphvizConfig = {
  cache?: MapLike;
  class?: string;
};

export const rehypeGraphviz: Plugin<[RehypeGraphvizConfig?], Root> = (
  options = {}
) => {
  const salt = {  class: options.class };
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    salt,
    language: "dot",
    code: ({ code }) => renderGraphviz({ code, class: options.class }),
  });
};

export default rehypeGraphviz;
