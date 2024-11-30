import fs from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { expect, it } from "vitest";

import rehypeGraphviz from "../src";

it("renders diagram", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeGraphviz)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  await expect(file.toString()).toMatchFileSnapshot("./fixtures/a.html");
});
