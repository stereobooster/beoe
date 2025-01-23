// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import { rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";
import { join } from "node:path";
import { penrose } from "./penrose.js";

export type RehypePenroseConfig = {
  shared: string;
  width?: number;
  height?: number;
  style?: string;
  domain?: string;
  variation?: string;
  namespace?: string;
};

export const rehypePenrose = rehypeCodeHookImg<RehypePenroseConfig>({
  language: "penrose",
  render: async (code: string, opts) => {
    if (!opts.domain || !opts.style)
      throw new Error("domain and style required");
    if (!opts.shared) opts.shared = "";
    if (!opts.width) opts.width = 400;
    if (!opts.height) opts.height = 400;

    return {
      svg: await penrose({
        substance: code,
        style: join(opts.shared, opts.style),
        domain: join(opts.shared, opts.domain),
        variation: opts.variation || "",
        width: opts.width,
        height: opts.height,
      }),
    };
  },
});

export default rehypePenrose;
