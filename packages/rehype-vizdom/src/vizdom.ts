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
          // disable a default plugin
          removeViewBox: false,
        },
      },
    },
  ],
};

/**
 * removes `width="..." height="..."` from svg tag
 * minifies SVG with `SVGO`
 * wraps in a figure with class `beoe vizdom`
 */
export const processVizdomSvg = (
  svg: string,
  className?: string,
  config?: SvgoConfig | boolean
) => {
  if (config !== false) {
    svg = optimize(
      svg,
      config === undefined || config === true ? svgoConfig : config
    ).data;
  }
  svg = svg.replace(/width="\d+[^"]+"\s+/, "");
  svg = svg.replace(/height="\d+[^"]+"\s+/, "");
  return `<figure class="beoe vizdom ${className || ""}">${svg}</figure>`;
};
