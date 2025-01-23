import fs from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { expect, it } from "vitest";

import rehypePlantuml from "../src";

// snapshots are different in CI and locally

it.skip("renders diagram", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePlantuml)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  await expect(file.toString()).toMatchFileSnapshot("./fixtures/a-inline.html");
});

it.skip("renders diagram", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePlantuml, { strategy: "img" })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  await expect(file.toString()).toMatchFileSnapshot(
    "./fixtures/a1-datauri.html"
  );
});
