// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import { rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";
import fs from "node:fs/promises";
import { join } from "node:path";
import { compile, optimize, toSVG } from "@penrose/core";
// TODO
import "global-jsdom/register";

export type RehypePenroseConfig = {
  shared: string;
  width?: number;
  height?: number;
  style?: string;
  domain?: string;
  variation?: string;
  namespace?: string;
};

// TODO https://github.com/penrose/penrose/blob/7b6c7ca6453f55242dff6baac37d8e10a62c5049/packages/roger/index.ts#L69
const pathResolver = (_path: string) => Promise.resolve(undefined);

export const rehypePenrose = rehypeCodeHookImg<RehypePenroseConfig>({
  language: "penrose",
  render: async (code: string, opts) => {
    const trio = {
      substance: `
      ${code}`,
      style: `
      canvas {
        width = ${opts.width || 400}
        height = ${opts.height || 400}
      }
      ${
        opts.style
          ? await fs.readFile(join(opts.shared, opts.style), {
              encoding: "utf-8",
            })
          : ""
      }
      `,
      domain: opts.domain
        ? await fs.readFile(join(opts.shared, opts.domain), {
            encoding: "utf-8",
          })
        : "",
      variation: opts.variation || "",
    };
    const compiled = await compile(trio);
    // console.log(trio);
    if (compiled.isErr()) {
      // console.log(showError(compiled.error));
      throw compiled.error;
    }
    const optimized = optimize(compiled.value);
    if (optimized.isErr()) {
      // console.log(showError(optimized.error));
      throw optimized.error;
    }
    const svg = (
      await toSVG(optimized.value, pathResolver, opts.namespace || "")
    ).outerHTML;
    // const s = new XMLSerializer();
    // s.serializeToString(svg);
    return { svg };
  },
});

export default rehypePenrose;
