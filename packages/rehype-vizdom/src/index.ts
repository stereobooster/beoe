import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { type Config as SvgoConfig } from "svgo";
import { processVizdomSvg } from "./vizdom.js";

import { DotParser } from "@vizdom/vizdom-ts-node";

export async function dotToSvg(code: string) {
  const parser = new DotParser();
  const dotGraph = parser.parse(code);
  const directedGraph = dotGraph.to_directed();
  const positioned = directedGraph.layout();
  const obj = positioned.to_json().to_obj();
  // JSON in Graphology format
  // const graph = {
  //   attributes: { name: "g" },
  //   options: { allowSelfLoops: true, multi: true, type: "directed" },
  //   nodes: obj.nodes.map((node) => ({
  //     key: `node-${node.unique_id}`,
  //     // attributes: {
  //     //   label: node.label,
  //     //   x: node.x,
  //     //   y: node.y,
  //     //   width: node.width,
  //     //   height: node.width,
  //     //   // url: node.url,
  //     // },
  //   })),
  //   edges: obj.edges.map((edge) => ({
  //     key: `edge-${edge.unique_id}`,
  //     source: `node-${edge.source}`,
  //     target: `node-${edge.target}`,
  //     // attributes: {
  //     //   label: edge.label,
  //     //   // url: edge.url,
  //     // },
  //   })),
  // };

  // JSON in Dagre format
  const graph = {
    options: {
      directed: true,
      multigraph: true,
      compound: false,
    },
    nodes: obj.nodes.map((node) => ({
      v: node.unique_id,
      // value: {},
    })),
    edges: obj.edges.map((edge) => ({
      v: edge.source,
      w: edge.target,
      name: edge.unique_id,
      // value: {},
    })),
  };
  const svg = await positioned.to_svg().to_string();
  return {
    svg,
    graph,
  };
}

export type RenderVizdomOptions = {
  code: string;
  class?: string;
  svgo?: SvgoConfig | boolean;
};

export { processVizdomSvg };

export type RehypeVizdomConfig = {
  cache?: MapLike;
  class?: string;
  svgo?: SvgoConfig | boolean;
  // if true adds data-graph to each figure with JSON representation of graph
  dataGraph?: boolean;
};

export const rehypeVizdom: Plugin<[RehypeVizdomConfig?], Root> = (
  options = {}
) => {
  const salt = {
    class: options.class,
    svgo: options.svgo,
    dataGraph: options.dataGraph,
  };
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    salt,
    language: "vizdom",
    code: ({ code }) =>
      dotToSvg(code).then(({ svg, graph }) =>
        processVizdomSvg(
          svg,
          options.class,
          options.svgo,
          options.dataGraph ? graph : undefined
        )
      ),
  });
};

export default rehypeVizdom;
