import { optimize, type Config as SvgoConfig } from "svgo";
import { LowercaseRec, Strategy } from "./svgStrategy.js";
import { DotParser } from "@vizdom/vizdom-ts-node";

// it is possible to add other formats, like Graphology etc.
export type GraphFormat = "dagre" | "graphology";

const svgoConfig: SvgoConfig = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // we need viewBox because width and height are removed
          removeViewBox: false,
          // we need ids for client-side interactivity
          cleanupIds: false,
          // this allows to style rects
          // convertShapeToPath: false,
        },
      },
    },
    // @ts-ignore
    {
      name: "removeAttrs",
      params: {
        attrs: ".*;(title|xlink:title)",
        elemSeparator: ";",
        preserveCurrentColor: false,
      },
    },
  ],
};

export type RenderOptions = {
  class?: string;
  svgo?: SvgoConfig | boolean;
  // adds data-graph to each figure with JSON representation of graph
  dataGraph?: GraphFormat;
  strategy?: Strategy;
};

export const render = async (code: string, options: LowercaseRec<RenderOptions>) => {
  const parser = new DotParser();
  const dotGraph = parser.parse(code);
  const directedGraph = dotGraph.to_directed();
  const positioned = directedGraph.layout();
  let svg = await positioned.to_svg().to_string();

  let graph;
  if (options.datagraph) {
    const obj = positioned.to_json().to_obj();
    if (options.datagraph === "graphology") {
      graph = {
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

    if (options.datagraph === "dagre") {
      graph = {
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

  if (options.svgo !== false) {
    // @ts-expect-error
    svgoConfig.plugins[0].params.overrides.cleanupIds = !options.datagraph;
    svg = optimize(
      svg,
      options.svgo === undefined || options.svgo === true
        ? svgoConfig
        : options.svgo
    ).data;
  }

  const widthMatch = svg.match(/width="(\d+[^"]+)"\s+/);
  const width = widthMatch ? widthMatch[1] : undefined;

  const heightMatch = svg.match(/height="(\d+[^"]+)"\s+/);
  const height = heightMatch ? heightMatch[1] : undefined;

  svg = svg.replace(/width="\d+[^"]+"\s+/, "");
  svg = svg.replace(/height="\d+[^"]+"\s+/, "");
  return { svg, width, height, graph };
};
