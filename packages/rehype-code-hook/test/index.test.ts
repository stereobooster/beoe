import fs from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { expect, it, vi } from "vitest";

import rehypeCodeHook from "../src";

it("does nothing if code returns undefined", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, {
      code: () => undefined,
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(file.toString()).toMatchFileSnapshot("./fixtures/a1.out.html");
});

it("supports html strings", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, {
      code: () => "<b>html</b>",
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(file.toString()).toMatchFileSnapshot("./fixtures/a2.out.html");
});

it("supports hast", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, {
      code: () => ({
        type: "element",
        tagName: "i",
        properties: {},
        children: [{ type: "text", value: "hast" }],
      }),
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(file.toString()).toMatchFileSnapshot("./fixtures/a3.out.html");
});

it("supports promises with undefined", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, {
      code: () => Promise.resolve(undefined),
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(file.toString()).toMatchFileSnapshot("./fixtures/a1.out.html");
});

it("supports promises with html string", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, {
      code: () => Promise.resolve("<b>html</b>"),
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(file.toString()).toMatchFileSnapshot("./fixtures/a2.out.html");
});

it("supports promises with hast", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, {
      code: () =>
        Promise.resolve({
          type: "element",
          tagName: "i",
          properties: {},
          children: [{ type: "text", value: "hast" }],
        }),
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(file.toString()).toMatchFileSnapshot("./fixtures/a3.out.html");
});

it("passes props to callback for code-block", async () => {
  const code = vi.fn(() => undefined);

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledWith({
    code: "test\n",
    inline: false,
    language: "js",
    metastring: "{3-4} fileName=test /a/",
  });
});

it("passes props to callback for code-inline", async () => {
  const code = vi.fn(() => undefined);

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/b.md", import.meta.url)));

  expect(code).toHaveBeenCalledWith({
    code: "test",
    inline: true,
    language: undefined,
    metastring: undefined,
  });
});

it("passes error and adds location in markdown", async () => {
  await expect(() =>
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeCodeHook, {
        code: () => {
          throw new Error("whatever");
        },
      })
      .use(rehypeStringify)
      .process("`test`")
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[1:1-1:7: whatever]`);
});

it("passes error and adds location in markdown", async () => {
  await expect(() =>
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeCodeHook, {
        code: () => Promise.reject(new Error("whatever")),
      })
      .use(rehypeStringify)
      .process("`test`")
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[1:1-1:7: whatever]`);
});
