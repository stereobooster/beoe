import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { d2, D2Options } from "./d2.js";
import svgToMiniDataURI from "mini-svg-data-uri";
import { h } from "hastscript";
// SVGO is an experiment. I'm not sure it can compress a lot, plus it can break some diagrams
import { optimize, type Config as SvgoConfig } from "svgo";
import { lex as lexMeta, parse as parseMeta } from "fenceparser";

const processMeta = (meta?: string): Record<string, any> =>
  meta ? parseMeta(lexMeta(meta)) : {};

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

export type RehypeD2Config = {
  cache?: MapLike;
  class?: string;
  /**
   * be carefull. It may break some diagrams
   */
  svgo?: SvgoConfig | boolean;
  strategy?: "inline" | "img";
  d2Options?: D2Options;
};

type RenderOptions = D2Options & {
  svgo?: SvgoConfig | boolean;
  strategy?: "inline" | "img";
};

function image({
  svg,
  ...rest
}: {
  width?: string;
  height?: string;
  alt?: string;
  svg: string;
  class?: string;
}) {
  return h("img", {
    src: svgToMiniDataURI(svg),
    ...rest,
  });
}

export const rehypeD2: Plugin<[RehypeD2Config?], Root> = (options = {}) => {
  const {
    svgo: svgoDefault,
    strategy: strategyDefault,
    d2Options: defaultOptions,
    ...rest
  } = options;

  const salt = options;

  const render = async (code: string, options: RenderOptions) => {
    let svg = await d2(code, { ...(defaultOptions || {}), ...options });

    const svgo = options.svgo ?? svgoDefault;
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

  // @ts-expect-error
  return rehypeCodeHook({
    ...rest,
    salt,
    language: "d2",
    code: async ({ code, meta }) => {
      const metaOptions = processMeta(meta);
      const strategy = metaOptions.strategy ?? strategyDefault;
      const cssClass = `${options.class || ""} ${
        metaOptions.class || ""
      }`.trim();

      switch (strategy) {
        case "img": {
          const { svg, width, height } = await render(code, metaOptions);
          return h(
            "figure",
            {
              class: `beoe d2 ${cssClass}`,
            },
            [image({ svg, width, height })]
          );
        }
        case "img-class-dark-mode": {
          const {
            svg: svgLight,
            width,
            height,
          } = await render(code, metaOptions);
          const { svg: svgDark } = await render(code, {
            ...metaOptions,
            theme: metaOptions.darktheme ?? defaultOptions?.darkTheme,
          });

          return h(
            "figure",
            {
              class: `beoe d2 ${cssClass}`,
            },
            // wrap in additional div for svg-pan-zoom
            [
              h("div", [
                image({ svg: svgLight, width, height, class: "beoe-light" }),
                image({ svg: svgDark, width, height, class: "beoe-dark" }),
              ]),
            ]
          );
        }
        // this doesn't work
        // case "inline-class-dark-mode": {
        //   const { svg: svgLight } = await render(code, metaOptions);
        //   const { svg: svgDark } = await render(code, {
        //     ...metaOptions,
        //     theme: metaOptions.darktheme ?? defaultOptions?.darkTheme,
        //   });
        //   return `<figure class="beoe d2 ${cssClass}">
        //     <div>
        //       <div class="beoe-light">${svgLight}</div>
        //       <div class="beoe-dark">${svgDark}</div>
        //     </div>
        //   </figure>`;
        // }
        default: {
          const { svg } = await render(code, metaOptions);
          return `<figure class="beoe d2 ${cssClass}">${svg}</figure>`;
        }
      }
    },
  });
};

export default rehypeD2;
