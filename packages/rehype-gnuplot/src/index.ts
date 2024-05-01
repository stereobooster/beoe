import type { Plugin } from "unified";
import type { Root } from "hast";
import { processGnuplotSvg } from "./gnuplot.js";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";

// // @ts-ignore
// import gnuplot from "gnuplot-wasm";
// const { render } = await gnuplot();
// const renderGnuplot = ({ code }: { code: string }) =>
//   processGnuplotSvg(render(code).svg);

import { waitFor } from "@beoe/rehype-code-hook";
// because gnuplot-wasm doesn't provide TS signatures
type R = (x: string) => { svg: string };
/**
 * If all gnuplot diagrams are cached it would not even load module in memory.
 * If there are diagrams, it would load module and first few renders would be async,
 * but all consequent renders would be sync
 */
export const renderGnuplot = waitFor(
  async () => {
    // @ts-ignore
    const gnuplot = (await import("gnuplot-wasm")).default;
    return (gnuplot() as Promise<{ render: R }>).then(({ render }) => render);
  },
  (render) => (o: { code: string; class?: string }) =>
    processGnuplotSvg(render(o.code).svg, o.class)
);

export { processGnuplotSvg };

export type RehypeGraphvizConfig = {
  cache?: MapLike;
  class?: string;
};

export const rehypeGnuplot: Plugin<[RehypeGraphvizConfig?], Root> = (
  options = {}
) => {
  const salt = { class: options.class };
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    salt,
    language: "gnuplot",
    code: ({ code }) => renderGnuplot({ code, class: options.class }),
  });
};

export default rehypeGnuplot;
