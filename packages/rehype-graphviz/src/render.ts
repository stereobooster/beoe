/**
 * it is possible to add other formats
 */
export type DataFormat = "dagre" | "graphology";

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

export type RehypeGraphvizConfig = {
  dataGraph: DataFormat;
  engine: Engine;
};

type RenderGraphvizOptions = RehypeGraphvizConfig & {
  code: string;
};

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
  (graphviz) =>
    ({ code, engine, dataGraph }: RenderGraphvizOptions) => {
      let data;
      if (dataGraph) {
        // without this I can't get consistent ids for JSON and SVG outputs
        code = graphviz.unflatten(code);
        code = graphviz.nop(code);

        const obj = JSON.parse(
          graphviz.layout(code, "dot_json", engine || "dot")
        );

        if (dataGraph === "graphology") {
          data = {
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

        if (dataGraph === "dagre") {
          data = {
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

      return {
        svg: cleanup(graphviz.layout(code, "svg", engine || "dot")),
        data,
      };
    }
);

/**
 * removes `<?xml version="1.0" encoding="UTF-8" standalone="no"?>`
 * removes `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"`
 */
const cleanup = (svg: string) => svg.split("\n").slice(6).join("\n");
