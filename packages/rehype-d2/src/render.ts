import { d2, D2Options } from "./d2.js";
import { optimize, type Config as SvgoConfig } from "svgo";
import { Strategy } from "./svgStrategy.js";

const svgoConfig: SvgoConfig = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // we need viewbox for inline SVGs
          removeViewBox: false,
        },
      },
    },
  ],
};

type RenderOptions = D2Options & {
  svgo?: SvgoConfig | boolean;
  strategy?: Strategy;
};

export const render = async (code: string, options: RenderOptions) => {
  let svg = await d2(code, options);
  const svgo = options.svgo;
  if (svgo !== false) {
    svg = optimize(
      svg,
      svgo === undefined || svgo === true ? svgoConfig : svgo
    ).data;
  }

  const widthMatch = svg.match(/width="(\d+[^"]+)"\s+/);
  const width = widthMatch ? widthMatch[1] : undefined;

  const heightMatch = svg.match(/height="(\d+[^"]+)"\s+/);
  const height = heightMatch ? heightMatch[1] : undefined;

  svg = svg.replace(/width="\d+[^"]+"\s+/, "");
  svg = svg.replace(/height="\d+[^"]+"\s+/, "");
  return { svg, width, height };
};
