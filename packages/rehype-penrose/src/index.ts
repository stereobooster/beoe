// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import { rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";
import { join } from "node:path";
import { penrose } from "./penrose.js";

export type PenroseOptions = {
  /**
   * path to shared folder for `.domain` and `.style` files
   */
  shared: string;
  /**
   * Width of diagram
   */
  width?: number;
  /**
   * Height of diagram
   */
  height?: number;
  /**
   * Name (or path) for `.style` file
   */
  style?: string;
  /**
   * Name (or path) for `.domain` file
   */
  domain?: string;
  variation?: string;
  namespace?: string;
};

export const rehypePenrose = rehypeCodeHookImg<PenroseOptions>({
  language: "penrose",
  svgo: false,
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
