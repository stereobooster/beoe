import type { Plugin } from "unified";
import type { Root } from "hast";
import { processGraphvizSvg } from "./graphviz.js";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { type Config as SvgoConfig } from "svgo";
import { lex as lexMeta, parse as parseMeta } from "fenceparser";

const processMeta = (meta?: string): Record<string, any> =>
  meta ? parseMeta(lexMeta(meta)) : {};

// it is possible to add other formats, like Graphology etc.
type GraphFormat = "dagre" | "graphology";

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
  dataGraph?: GraphFormat;
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
  (graphviz) => (o: RenderGraphvizOptions) => {
    let code = o.code;
    let graph;
    if (o.dataGraph) {
      // without this I can't get consistent ids for JSON and SVG outputs
      code = graphviz.unflatten(code);
      code = graphviz.nop(code);

      const obj = JSON.parse(
        graphviz.layout(code, "dot_json", o.engine || "dot")
      );

      if (o.dataGraph === "graphology") {
        graph = {
          attributes: { name: "g" },
          options: {
            allowSelfLoops: true,
            multi: true,
            type: obj.directed ? "directed" : "mixed",
          },
          nodes: obj.objects.map((node: any) => ({
            key: node._gvid + 1,
          })),
          edges: obj.edges.map((edge: any) => ({
            key: edge._gvid + 1,
            source: edge.tail + 1,
            target: edge.head + 1,
          })),
        };
      }

      if (o.dataGraph === "dagre") {
        graph = {
          options: {
            directed: obj.directed,
            multigraph: true,
            compound: false,
          },
          nodes: obj.objects.map((node: any) => ({
            v: node.unique_id + 1,
          })),
          edges: obj.edges.map((edge: any) => ({
            v: edge.tail + 1,
            w: edge.head + 1,
            name: edge._gvid + 1,
          })),
        };
      }
    }

    return processGraphvizSvg(
      graphviz.layout(code, "svg", o.engine || "dot"),
      o.class,
      o.svgo,
      graph
    );
  }
);

export { processGraphvizSvg };

export type RehypeGraphvizConfig = {
  cache?: MapLike;
  class?: string;
  svgo?: SvgoConfig | boolean;
  // adds data-graph to each figure with JSON representation of graph
  dataGraph?: GraphFormat;
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
    code: ({ code, meta }) => {
      const metaOptions = processMeta(meta);
      const dataGraph =
        metaOptions.datagraph !== undefined
          ? metaOptions.datagraph
          : options.dataGraph;
      const cssClass = `${options.class || ""} ${metaOptions.class || ""}`.trim();
      const svgo =
        metaOptions.svgo !== undefined ? metaOptions.svgo : options.svgo;

      return renderGraphviz({ code, class: cssClass, svgo, dataGraph });
    },
  });
};

export default rehypeGraphviz;
