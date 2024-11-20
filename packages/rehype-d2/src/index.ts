import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { d2, D2Options } from "./d2.js";
// SVGO is an experiment. I'm not sure it can compress a lot, plus it can break some diagrams
import { optimize, type Config as SvgoConfig } from "svgo";
import { lex as lexMeta, parse as parseMeta } from "fenceparser";
import { Strategy, svgStrategyCbAsync } from "./svgStrategy.js";

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
  strategy?: Strategy;
  d2Options?: D2Options;
};

type RenderOptions = D2Options & {
  svgo?: SvgoConfig | boolean;
  strategy?: Strategy;
};

export const rehypeD2: Plugin<[RehypeD2Config?], Root> = (options = {}) => {
  const {
    svgo: svgoDefault,
    strategy: strategyDefault,
    d2Options: defaultOptions,
    ...rest
  } = options;

  const salt = { svgoDefault, strategyDefault, defaultOptions };

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
      const cssClass = `d2 ${options.class || ""} ${
        metaOptions.class || ""
      }`.trim();

      return svgStrategyCbAsync(strategy, cssClass, async (darkMode) => {
        let darkSvg: string | undefined;
        const {
          svg: lightSvg,
          width,
          height,
        } = await render(code, metaOptions);
        if (darkMode) {
          const res = await render(code, {
            ...metaOptions,
            theme: metaOptions.darktheme ?? defaultOptions?.darkTheme ?? 200,
          });
          darkSvg = res.svg;
        }
        return { lightSvg, width, height, darkSvg };
      });
    },
  });
};

export default rehypeD2;
