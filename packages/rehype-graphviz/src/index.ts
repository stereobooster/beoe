import type { Plugin } from "unified";
import type { Root } from "hast";
import { graphvizSvg } from "./graphviz.js";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";

export { graphvizSvg };

export type RehypeGraphvizConfig = {
  cache?: MapLike;
};

export const rehypeGraphviz: Plugin<[RehypeGraphvizConfig], Root> = (
  options
) => {
  // @ts-expect-error
  return rehypeCodeHook({
    // intentionally do not pass cache to rehypeCodeHook
    // because cache is handled by plugin itself
    code: ({ language, code }) => {
      if (language !== "dot") return undefined;
      code = code.trim();
      if (options.cache) {
        if (options.cache.has(code)) {
          return options.cache.get(code);
        } else {
          const result = fromHtmlIsomorphic(graphvizSvg(code), {
            fragment: true,
          });
          options.cache.set(code, result);
          return result;
        }
      } else {
        return graphvizSvg(code);
      }
    },
  });
};

export default rehypeGraphviz;
