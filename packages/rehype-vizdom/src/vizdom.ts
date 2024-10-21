import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
// SVGO is an experiment. I'm not sure it can compress a lot, plus it can break some diagrams
import { optimize, type Config as SvgoConfig } from "svgo";

export type VizdomSvgOptions = {
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
 * minifies SVG with `SVGO`
 * wraps in a figure with class `beoe vizdom`
 */
export const processVizdomSvg = (
  svg: string,
  className?: string,
  config?: SvgoConfig | boolean,
  graph?: any
) => {
  if (config !== false) {
    // @ts-expect-error
    svgoConfig.plugins[0].params.overrides.cleanupIds = !graph;
    svg = optimize(
      svg,
      config === undefined || config === true ? svgoConfig : config
    ).data;
  }
  const element = fromHtmlIsomorphic(svg, { fragment: true });
  return {
    type: "element",
    tagName: "figure",
    properties: {
      class: `beoe vizdom ${className || ""}`.trim(),
      "data-graph": graph ? JSON.stringify(graph) : undefined,
    },
    children: element.children,
  };
};
