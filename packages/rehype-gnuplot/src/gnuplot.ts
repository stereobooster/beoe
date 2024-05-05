// SVGO is an experiment. I'm not sure it can compress a lot, plus it can break some diagrams
import { optimize, type Config as SvgoConfig } from "svgo";

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
 * removes `<?xml version="1.0" encoding="utf-8"  standalone="no"?>`
 * removes `width="..." height="..."` from svg tag
 * minifies SVG with `SVGO`
 * wraps in a figure with class `beoe gnuplot`
 */
export const processGnuplotSvg = (
  svg: string,
  className?: string,
  config?: SvgoConfig | boolean
) => {
  svg = svg.split("\n").slice(1).join("\n");
  if (config !== false) {
    svg = optimize(
      svg,
      config === undefined || config === true ? svgoConfig : config
    ).data;
  }
  svg = svg.replace(/\s+width="\d+[^"]*"/, "");
  svg = svg.replace(/\s+height="\d+[^"]*"/, "");
  return `<figure class="beoe gnuplot ${className || ""}">${svg}</figure>`;
};
