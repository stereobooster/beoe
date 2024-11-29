import fs from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { expect, it, describe, vi } from "vitest";

import { rehypeCodeHookImg } from "../src/index.js";
import { Strategy } from "../src/types.js";

describe("strategy", () => {
  (
    [undefined, "inline", "img", "picture-dark-mode", "img-class-dark-mode"] as Strategy[]
  ).forEach((strategy) => {
    it(`${strategy}`, async () => {
      const testHook = rehypeCodeHookImg({
        language: "test",
        render: (_a, _b) => ({
          svg: "<svg>light</svg>",
          darkSvg: "<svg>dark</svg>",
          width: 1,
          height: 2,
          data: {},
        }),
      });
      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(testHook, { strategy })
        .use(rehypeStringify)
        .process(
          await fs.readFile(new URL("./fixtures/a.md", import.meta.url))
        );

      expect(file.toString()).toMatchFileSnapshot(
        `./fixtures/strategy_${strategy}.out.html`
      );
    });
  });
});

