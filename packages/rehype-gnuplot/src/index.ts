import type { Plugin } from "unified";
import type { Root } from "hast";
import { gnuplotSvg } from "./gnuplot.js";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";

export { gnuplotSvg };

export type RehypeGraphvizConfig = {
  cache?: MapLike;
};

export const rehypeGnuplot: Plugin<[RehypeGraphvizConfig?], Root> = (
  options = {}
) => {
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    code: ({ language, code }) => {
      if (language !== "gnuplot") return undefined;
      return gnuplotSvg(code);
    },
  });
};

export default rehypeGnuplot;
