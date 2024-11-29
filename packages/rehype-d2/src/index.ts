import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { D2Options } from "./d2.js";
// SVGO is an experiment. I'm not sure it can compress a lot, plus it can break some diagrams
import { type Config as SvgoConfig } from "svgo";
import {
  Strategy,
  svgStrategyCbAsync,
  metaWithDefaults,
} from "./svgStrategy.js";
import { render } from "./render.js";

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

export const rehypeD2: Plugin<[RehypeD2Config?], Root> = (options = {}) => {
  const { svgo, strategy, d2Options, ...rest } = options;
  const defaults = {
    svgo,
    strategy,
    d2Options,
  };
  const salt = defaults;
  const language = "d2";

  // @ts-expect-error
  return rehypeCodeHook({
    ...rest,
    salt,
    language,
    code: async ({ code, meta }) => {
      const opts = metaWithDefaults(language, defaults, meta);

      return svgStrategyCbAsync(opts.strategy, opts.class, async (darkMode) => {
        let darkSvg: string | undefined;
        const { svg: lightSvg, width, height } = await render(code, opts);
        if (darkMode) {
          const res = await render(code, {
            ...opts,
            theme: opts.darkTheme ?? defaults.d2Options?.darkTheme ?? "200",
          });
          darkSvg = res.svg;
        }
        return { lightSvg, width, height, darkSvg };
      });
    },
  });
};

export default rehypeD2;
