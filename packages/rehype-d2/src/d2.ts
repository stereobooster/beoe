// @ts-ignore https://github.com/terrastruct/d2/issues/2286
import { D2 } from "@terrastruct/d2";
import { glob, GlobOptions } from "tinyglobby";
// @ts-expect-error
import memoizeOne from "async-memoize-one";
import fs from "node:fs/promises";

export type D2Options = {
  layout?: "dagre" | "elk";
  sketch?: boolean;
  themeID?: number;
  graphFormat?: "graphology" | "dagre";
  shared?: string | string[] | GlobOptions;
};

const mGlob = memoizeOne(async (x: string | string[] | GlobOptions) => {
  // @ts-expect-error
  const paths = await glob(x);
  const result: Record<string, string> = Object.create(null);
  // probably not the best way to do it, but for small number of files should be ok
  await Promise.all(
    paths.map((path) =>
      fs
        .readFile(path, { encoding: "utf-8" })
        .then((content) => (result[path] = content))
    )
  );
  return result;
});

export async function d2(code: string, options: D2Options) {
  const d2Instance = new D2();

  const fs: Record<string, string> = options.shared
    ? { ...(await mGlob(options.shared)), index: code }
    : { index: code };
  const result = await d2Instance.compile({ fs }, options);

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

  const svg = (await d2Instance.render(result.diagram, options)) as string;
  return { svg, data };
}
