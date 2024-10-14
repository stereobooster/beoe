import { fromDot, NodeModel, NodeRef } from "ts-graphviz";
import {
  DirectedGraph,
  RankDir,
  Shape,
  VertexWeakRef,
} from "@stereobooster/vizdom-ts-esm";

function titleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}

const shapes: Record<string, number> = {
  Rectangle: Shape.Rectangle,
  Rect: Shape.Rectangle,
  Square: Shape.Square,
  Box: Shape.Square,
  Circle: Shape.Circle,
  Ellipse: Shape.Ellipse,
  Oval: Shape.Ellipse,
  Default: Shape.Ellipse,
  Triangle: Shape.Triangle,
  Diamond: Shape.Diamond,
  Plaintext: Shape.Plaintext,
  Underline: Shape.Underline,
};

function shape(node: NodeModel) {
  const sh = node.attributes.get("shape");
  if (!sh) return shapes.Default;
  return shapes[titleCase(sh)] ?? shapes.Default;
}

const rankDirs = {
  TB: RankDir.TB,
  BT: RankDir.BT,
  LR: RankDir.LR,
  RL: RankDir.RL,
};

export async function dotToSvg(code: string) {
  const graph = new DirectedGraph();
  const model = fromDot(code);
  graph.attrs().set((graph) => {
    if (!graph.layout) graph.layout = {};
    if (model.get("rankdir")) {
      graph.layout.rank_dir = rankDirs[model.get("rankdir")!];
    }
    return graph;
  });

  const nodes: Record<string, VertexWeakRef> = {};
  model.nodes.forEach((node) => {
    nodes[node.id] = graph.new_vertex({
      render: {
        id: node.id,
        label: node.attributes.get("label"),
        tooltip: node.attributes.get("tooltip"),
        shape: shape(node),
        // fill_color: node.attributes.get("fillcolor") as string,
        // font_color: node.attributes.get("fontcolor") as string,
        // color: node.attributes.get("color") as string,
        // font_size: node.attributes.get("fontsize"),
        // pen_width: node.attributes.get("penwidth"),
        // style: node.attributes.get("style") as any,
      },
    });
  });

  model.subgraphs.forEach((subg) => {
    // TODO
  });

  model.edges.forEach((edge) => {
    for (let i = 0; i <= edge.targets.length - 2; i++) {
      const from: NodeRef[] = (
        Array.isArray(edge.targets[i]) ? edge.targets[i] : [edge.targets[i]]
      ) as any;
      const to: NodeRef[] = (
        Array.isArray(edge.targets[i + 1])
          ? edge.targets[i + 1]
          : [edge.targets[i + 1]]
      ) as any;

      from.forEach((f) => {
        if (!nodes[f.id]) {
          nodes[f.id] = graph.new_vertex({
            render: {
              label: f.id,
              id: f.id,
              shape: shapes.Default,
            },
          });
        }
        to.forEach((t) => {
          if (!nodes[t.id]) {
            nodes[t.id] = graph.new_vertex({
              render: {
                label: t.id,
                id: t.id,
                shape: shapes.Default,
              },
            });
          }

          graph.new_edge(nodes[f.id], nodes[t.id], {
            render: {
              label: edge.attributes.get("label"),
              tooltip: edge.attributes.get("tooltip"),
              // pen_width: edge.attributes.get("penwidth"),
              // font_size: edge.attributes.get("fontsize"),
              // style: edge.attributes.get("style") as any,
              // // shape: edge.attributes.get("shape") as any,
              // // curve: edge.attributes.get("curve") as any,
              // arrow_head: edge.attributes.get("arrowhead") as any,
              // dir: edge.attributes.get("dir") as any,
              // color: edge.attributes.get("color") as string,
              // font_color: edge.attributes.get("fontcolor") as string,
              // fill_color: edge.attributes.get("fillcolor") as string,
              // // id?: string;
            },
          });
        });
      });
    }
  });

  //   const positioned = graph.layout();
  const positioned = graph.layout();
  return await positioned.to_svg().to_string();
}
