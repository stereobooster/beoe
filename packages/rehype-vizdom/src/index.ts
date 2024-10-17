import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { type Config as SvgoConfig } from "svgo";
import { processVizdomSvg } from "./vizdom.js";

import { DotParser } from "@vizdom/vizdom-ts-node";

export async function dotToSvg(code: string) {
  const parser = new DotParser();
  const dotGraph = parser.parse(code);
  const directedGraph = dotGraph.to_directed();
  const positioned = directedGraph.layout();
  return await positioned.to_svg().to_string();
}

export type RenderVizdomOptions = {
  code: string;
  class?: string;
  svgo?: SvgoConfig | boolean;
};

export { processVizdomSvg };

export type RehypeVizdomConfig = {
  cache?: MapLike;
  class?: string;
  svgo?: SvgoConfig | boolean;
};

export const rehypeVizdom: Plugin<[RehypeVizdomConfig?], Root> = (
  options = {}
) => {
  const salt = { class: options.class, svgo: options.svgo };
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    salt,
    language: "vizdom",
    code: ({ code }) =>
      dotToSvg(code).then((str) =>
        processVizdomSvg(str, options.class, options.svgo)
      ),
  });
};

export default rehypeVizdom;
