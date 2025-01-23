// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import { rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";
import fs from "node:fs/promises";
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
    const trio = {
      substance: code,
      style: `canvas {
        width = ${opts.width || 400}
        height = ${opts.height || 400}
      }
      ${
        opts.style
          ? await fs.readFile(join(opts.shared, opts.style), {
              encoding: "utf-8",
            })
          : ""
      }`,
      domain: opts.domain
        ? await fs.readFile(join(opts.shared, opts.domain), {
            encoding: "utf-8",
          })
        : "",
      variation: opts.variation || "",
    };
    const svg = await penrose(trio);
    return { svg };
  },
});

export default rehypePenrose;
