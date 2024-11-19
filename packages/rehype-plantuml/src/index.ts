import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
// @ts-ignore
import plantuml from "plantuml";
import svgToMiniDataURI from "mini-svg-data-uri";
import { h } from "hastscript";
// SVGO is an experiment. I'm not sure it can compress a lot, plus it can break some diagrams
import { optimize, type Config as SvgoConfig } from "svgo";

const svgoConfig: SvgoConfig = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // we need viewbox for inline SVGs
          removeViewBox: false,
          // this breaks statediagram
          convertShapeToPath: false,
        },
      },
    },
  ],
};

export type RehypePlantumlConfig = {
  cache?: MapLike;
  class?: string;
  /**
   * be carefull. It may break some diagrams. For example, stateDiagram-v2
   */
  svgo?: SvgoConfig | boolean;
  strategy?: "inline" | "img";
};

export const rehypePlantuml: Plugin<[RehypePlantumlConfig?], Root> = (
  options = {}
) => {
  const { svgo, strategy, ...rest } = options;

  const salt = options;

  const render = async (code: string) => {
    let svg: string = await plantuml(code);
    if (svgo !== false) {
      svg = optimize(
        svg,
        svgo === undefined || svgo === true ? svgoConfig : svgo
      ).data;
    }
    svg = svg.replace(`contentStyleType="text/css"`, "");
    svg = svg.replace(`preserveAspectRatio="none"`, "");
    svg = svg.replace(`zoomAndPan="magnify"`, "");
    svg = svg.replace(/style="[^"]+"\s+/, "");

    const widthMatch = svg.match(/width="(\d+[^"]+)"\s+/);
    const width = widthMatch ? widthMatch[1] : undefined;

    const heightMatch = svg.match(/height="(\d+[^"]+)"\s+/);
    const height = heightMatch ? heightMatch[1] : undefined;

    svg = svg.replace(/width="\d+[^"]+"\s+/, "");
    svg = svg.replace(/height="\d+[^"]+"\s+/, "");
    return { svg, width, height };
  };

  // @ts-expect-error
  return rehypeCodeHook({
    ...rest,
    salt,
    language: "plantuml",
    code: async ({ code }) => {
      switch (strategy) {
        case "img": {
          const { svg, width, height } = await render(code);
          return h(
            "figure",
            {
              class: `beoe plantuml ${rest.class || ""}`,
            },
            // wrap in additional div for svg-pan-zoom
            h("img", {
              width,
              height,
              alt: "",
              src: svgToMiniDataURI(svg),
            })
          );
        }
        default: {
          const { svg } = await render(code);
          return `<figure class="beoe plantuml ${
            rest.class || ""
          }">${svg}</figure>`;
        }
      }
    },
  });
};

export default rehypePlantuml;
