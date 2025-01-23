import fs from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { expect, it, describe, vi } from "vitest";

import { rehypeCodeHookImg } from "../src/index.js";
import { Strategy } from "../src/types.js";

type Example = { input: string; output: string; testHook: any; options?: any };

async function example({ input, output, testHook, options }: Example) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(testHook, options)
    .use(rehypeStringify)
    .process(
      await fs.readFile(new URL(`./fixtures/${input}.md`, import.meta.url))
    );

  await expect(file.toString()).toMatchFileSnapshot(
    `./fixtures/${output}.out.html`
  );
}

const testHook = rehypeCodeHookImg({
  language: "test",
  render: (_a, _b) => ({
    svg: "<svg>light</svg>",
    darkSvg: "<svg>dark</svg>",
    width: 1,
    height: 2,
  }),
});

describe("strategy", () => {
  (
    [
      undefined,
      "inline",
      "data-url",
      // "file"
      // "img",
      // "picture-dark-mode",
      // "img-class-dark-mode",
    ] as Strategy[]
  ).forEach((strategy) => {
    it(`${strategy}`, async () => {
      await example({
        input: "a",
        output: `strategy_${strategy}`,
        testHook,
        options: { strategy },
      });
    });
  });

  it("strategy in meta", async () => {
    await example({
      input: "c",
      output: "strategy_in_meta",
      testHook,
      options: { strategy: "inline" },
    });
  });
});

describe("class", () => {
  it("can pass class", async () => {
    await example({
      input: "b",
      output: "class",
      testHook,
      options: { class: "x" },
    });
  });
});
