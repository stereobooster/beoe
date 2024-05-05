import type { Plugin } from "unified";
import type { Root } from "hast";
import { processGraphvizSvg } from "./graphviz.js";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { type Config as SvgoConfig } from "svgo";

// import { type Engine } from "@hpcc-js/wasm";
type Engine =
  | "circo"
  | "dot"
  | "fdp"
  | "sfdp"
  | "neato"
  | "osage"
  | "patchwork"
  | "twopi"
  | "nop"
  | "nop2";
export type RenderGraphvizOptions = {
  code: string;
  class?: string;
  /* it is possible to change layout with in dot code itself */
  engine?: Engine;
  svgo?: SvgoConfig | boolean;
};

// import { Graphviz } from "@hpcc-js/wasm";
// const graphviz = await Graphviz.load();
// export const renderGraphviz = (o: RenderGraphvizOptions) =>
//   processGraphvizSvg(
//     graphviz.layout(o.code, "svg", o.engine || "dot"),
//     o.class
//   );

import { waitFor } from "@beoe/rehype-code-hook";
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
    processGraphvizSvg(
      graphviz.layout(o.code, "svg", o.engine || "dot"),
      o.class,
      o.svgo
    )
);

export { processGraphvizSvg };

export type RehypeGraphvizConfig = {
  cache?: MapLike;
  class?: string;
  svgo?: SvgoConfig | boolean;
};

export const rehypeGraphviz: Plugin<[RehypeGraphvizConfig?], Root> = (
  options = {}
) => {
  const salt = { class: options.class, svgo: options.svgo };
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    salt,
    language: "dot",
    code: ({ code }) =>
      renderGraphviz({ code, class: options.class, svgo: options.svgo }),
  });
};

export default rehypeGraphviz;
