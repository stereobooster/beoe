// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import { rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";
import { waitFor } from "@beoe/rehype-code-hook";

// because gnuplot-wasm doesn't provide TS signatures
type R = (x: string) => { svg: string };
/**
 * If all gnuplot diagrams are cached it would not even load module in memory.
 * If there are diagrams, it would load module and first few renders would be async,
 * but all consequent renders would be sync
 */
export const render = waitFor(
  async () => {
    // @ts-ignore
    const gnuplot = (await import("gnuplot-wasm")).default;
    return (gnuplot() as Promise<{ render: R }>).then(({ render }) => render);
  },
  (render) => (code: string) => render(code)
);

export type RehypeGnuplotConfig = {};

export const rehypeGnuplot = rehypeCodeHookImg<RehypeGnuplotConfig>({
  language: "gnuplot",
  render,
});

export default rehypeGnuplot;
