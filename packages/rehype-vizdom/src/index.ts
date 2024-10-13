import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { type Config as SvgoConfig } from "svgo";
import { parse, toModel } from "@ts-graphviz/ast";
import { processVizdomSvg } from "./vizdom.js";
import { DirectedGraph, VertexWeakRef } from "@vizdom/vizdom-ts-esm";

export async function getSvg(code: string) {
  const graph = new DirectedGraph();
  const ast = parse(code);
  const model = toModel(ast);

  const nodes: Record<string, VertexWeakRef> = {};
  model.nodes.forEach((node) => {
    nodes[node.id] = graph.new_vertex({
      render: {
        id: node.id,
        label: node.attributes.get("label"),
        tooltip: node.attributes.get("tooltip"),
        fill_color: node.attributes.get("fillcolor") as string,
        font_color: node.attributes.get("fontcolor") as string,
        color: node.attributes.get("color") as string,
        font_size: node.attributes.get("fontsize"),
        pen_width: node.attributes.get("penwidth"),
        shape: node.attributes.get("shape") as any,
        style: node.attributes.get("style") as any,
      },
    });
  });

  model.edges.forEach((edge) => {
    const from = edge.targets[0];
    const to = edge.targets[0];

    if (Array.isArray(from) || Array.isArray(to)) {
      throw new Error("what is it?");
    }

    graph.new_edge(nodes[from.id], nodes[to.id], {
      render: {
        pen_width: edge.attributes.get("penwidth"),
        font_size: edge.attributes.get("fontsize"),
        style: edge.attributes.get("style") as any,
        // shape: edge.attributes.get("shape") as any,
        // curve: edge.attributes.get("curve") as any,
        arrow_head: edge.attributes.get("arrowhead") as any,
        dir: edge.attributes.get("dir") as any,
        color: edge.attributes.get("color") as string,
        font_color: edge.attributes.get("fontcolor") as string,
        fill_color: edge.attributes.get("fillcolor") as string,
        // id?: string;
        label: edge.attributes.get("label"),
        tooltip: edge.attributes.get("tooltip"),
      },
    });
  });

  const positioned = graph.layout();
  return await positioned.to_svg().to_string();
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
};

export const rehypeVizdom: Plugin<[RehypeVizdomConfig?], Root> = (
  options = {}
) => {
  const salt = { class: options.class, svgo: options.svgo };
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    salt,
    language: "dot",
    code: ({ code }) =>
      getSvg(code).then((str) =>
        processVizdomSvg(str, options.class, options.svgo)
      ),
  });
};

export default rehypeVizdom;
