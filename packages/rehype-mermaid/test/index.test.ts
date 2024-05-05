import fs from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { afterAll, beforeAll, expect, it, vi } from "vitest";

import rehypeMermaid from "../src";

beforeAll(() => {
  const m = {
    random: vi.fn(() => 0.1),
    trunc: Math.trunc,
    abs: Math.abs,
    max: Math.max,
    floor: Math.floor,
  };

  vi.stubGlobal("Math", m);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

it("renders diagram", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMermaid)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  console.log(file.toString());
  expect(file.toString()).toMatchFileSnapshot("./fixtures/a.html");
});
