import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { render, RenderOptions } from "./render.js";
import { metaWithDefaults, svgStrategyCbAsync } from "./svgStrategy.js";

export type RehypeVizdomConfig = RenderOptions & {
  cache?: MapLike;
};

export const rehypeVizdom: Plugin<[RehypeVizdomConfig?], Root> = (
  options = {}
) => {
  const defaults = {
    class: options.class,
    svgo: options.svgo,
    strategy: options.strategy,
    dataGraph: options.dataGraph,
  };
  const language = "vizdom";
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    salt: defaults,
    language,
    code: ({ code, meta }) => {
      const opts = metaWithDefaults(language, defaults, meta);

      return svgStrategyCbAsync(opts.strategy, opts.class, async () => {
        const { svg: lightSvg, width, height, graph } = await render(code, opts);
        return { lightSvg, width, height, graph };
      });
    },
  });
};

export default rehypeVizdom;
