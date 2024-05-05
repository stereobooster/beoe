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
          // disable a default plugin
          removeViewBox: false,
        },
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
  config?: SvgoConfig
) => {
  svg = svg.split("\n").slice(6).join("\n");
  svg = optimize(svg, config || svgoConfig).data;
  svg = svg.replace(/width="\d+[^"]+"\s+/, "");
  svg = svg.replace(/height="\d+[^"]+"\s+/, "");
  return `<figure class="beoe graphviz ${className || ""}">${svg}</figure>`;
};
