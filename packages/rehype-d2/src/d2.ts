// @ts-ignore https://github.com/terrastruct/d2/issues/2286
import { D2 } from "@terrastruct/d2";

export type D2Options = {
  layout?: "dagre" | "elk";
  sketch?: boolean;
  themeID?: number;
  graphFormat?: "graphology" | "dagre";
};

export async function d2(code: string, options: D2Options) {
  const d2Instance = new D2();
  const result = await d2Instance.compile(code, options);

  let data;
  if (options.graphFormat) {
    if (options.graphFormat === "graphology") {
      data = {
        attributes: { name: "g" },
        options: { allowSelfLoops: true, multi: true, type: "directed" },
        nodes: result.diagram.shapes.map((node: any) => ({
          key: node.id,
          // attributes: {
          //   label: node.label,
          //   x: node.pos.x,
          //   y: node.pos.y,
          //   width: node.width,
          //   height: node.height,
          //   url: node.url,
          // },
        })),
        edges: result.diagram.connections.map((edge: any) => ({
          key: edge.id,
          source: edge.src,
          target: edge.dst,
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
        nodes: result.diagram.shapes.map((node: any) => ({
          v: node.id,
          // value: {},
        })),
        edges: result.diagram.connections.map((edge: any) => ({
          v: edge.src,
          w: edge.dst,
          name: edge.id,
          // value: {},
        })),
      };
    }
  }

  const svg = await d2Instance.render(result.diagram, options) as string;
  return { svg, data };
}
