import { DotParser } from "@vizdom/vizdom-ts-node";

/**
 * it is possible to add other formats
 */
export type DataFormat = "dagre" | "graphology";

export type RehypeVizdomConfig = {
  graphFormat: DataFormat
};

export const render = async (code: string, options: RehypeVizdomConfig) => {
  const parser = new DotParser();
  const dotGraph = parser.parse(code);
  const directedGraph = dotGraph.to_directed();
  const positioned = directedGraph.layout();
  const svg = await positioned.to_svg().to_string();

  let data;
  if (options.graphFormat) {
    const obj = positioned.to_json().to_obj();
    if (options.graphFormat === "graphology") {
      data = {
        attributes: { name: "g" },
        options: { allowSelfLoops: true, multi: true, type: "directed" },
        nodes: obj.nodes.map((node) => ({
          key: node.unique_id,
          // attributes: {
          //   label: node.label,
          //   x: node.x,
          //   y: node.y,
          //   width: node.width,
          //   height: node.width,
          //   url: node.url,
          // },
        })),
        edges: obj.edges.map((edge) => ({
          key: edge.unique_id,
          source: edge.source,
          target: edge.target,
          // attributes: {
          //   label: edge.label,
          //   url: edge.url,
          // },
        })),
      };
    }

    if (options.graphFormat === "dagre") {
      data = {
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
    }
  }

  return { svg, data };
};
