import fs from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { afterAll, beforeAll, expect, it, vi } from "vitest";

import rehypePlantuml from "../src";

beforeAll(() => {
  const m = {
    random: vi.fn(() => 0.1),
    trunc: Math.trunc,
    abs: Math.abs,
    max: Math.max,
    floor: Math.floor,
    pow: Math.pow,
    round: Math.round,
    min: Math.min,
  };

  vi.stubGlobal("Math", m);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

// snapshots are different in CI and locally

it.skip("renders diagram", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePlantuml)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(file.toString()).toMatchFileSnapshot("./fixtures/a-inline.html");
});

it.skip("renders diagram", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePlantuml, { strategy: "img" })
    .use(rehypeStringify)
    .process(
      await fs.readFile(new URL("./fixtures/a.md", import.meta.url))
    );

  expect(file.toString()).toMatchFileSnapshot("./fixtures/a1-datauri.html");
});
