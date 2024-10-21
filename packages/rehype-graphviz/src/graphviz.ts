import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
// SVGO is an experiment. I'm not sure it can compress a lot, plus it can break some diagrams
import { optimize, type Config as SvgoConfig } from "svgo";

export type GraphvizSvgOptions = {
  class?: string;
};

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

/**
 * removes `<?xml version="1.0" encoding="UTF-8" standalone="no"?>`
 * removes `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"`
 * removes `width="..." height="..."` from svg tag
 * minifies SVG with `SVGO`
 * wraps in a figure with class `beoe graphviz`
 */
export const processGraphvizSvg = (
  svg: string,
  className?: string,
  config?: SvgoConfig | boolean,
  graph?: any
) => {
  svg = svg.split("\n").slice(6).join("\n");
  if (config !== false) {
    // @ts-expect-error
    svgoConfig.plugins[0].params.overrides.cleanupIds = !graph;
    svg = optimize(
      svg,
      config === undefined || config === true ? svgoConfig : config
    ).data;
  }
  svg = svg.replace(/width="\d+[^"]+"\s+/, "");
  svg = svg.replace(/height="\d+[^"]+"\s+/, "");
  const element = fromHtmlIsomorphic(svg, { fragment: true });
  return {
    type: "element",
    tagName: "figure",
    properties: {
      class: `beoe graphviz ${className || ""}`.trim(),
      "data-graph": graph ? JSON.stringify(graph) : undefined,
    },
    children: element.children,
  };
};
