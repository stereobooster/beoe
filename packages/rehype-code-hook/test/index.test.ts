import fs from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { expect, it, vi } from "vitest";

import { rehypeCodeHook } from "../src/index.js";
// it's ok to use direct import in test use file directly
import { SQLiteCache } from "../../sqlitecache/src/index.js";

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
    meta: "{3-4} fileName=test /a/",
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
    meta: undefined,
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

it("caches undefined", async () => {
  const code = vi.fn(() => undefined);
  const cache = new Map();

  // twice in the same run
  const file1 = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, cache, hashTostring: true })
    .use(rehypeStringify)
    .process("`code` `code`");
  expect(file1.toString()).toMatchInlineSnapshot(
    `"<p><code>code</code> <code>code</code></p>"`
  );

  // once in different run
  const file2 = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, cache, hashTostring: true })
    .use(rehypeStringify)
    .process("`code`");
  expect(file2.toString()).toMatchInlineSnapshot(`"<p><code>code</code></p>"`);

  expect(code).toHaveBeenCalledTimes(1);
});

it("can cache with Map", async () => {
  const code = vi.fn(() => "test");
  const cache = new Map();

  // twice in the same run
  const file1 = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, cache, hashTostring: true })
    .use(rehypeStringify)
    .process("`code` `code`");
  expect(file1.toString()).toMatchInlineSnapshot(`"<p>test test</p>"`);

  // once in different run
  const file2 = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, cache, hashTostring: true })
    .use(rehypeStringify)
    .process("`code`");
  expect(file2.toString()).toMatchInlineSnapshot(`"<p>test</p>"`);

  // but called only once instead of 3
  expect(code).toHaveBeenCalledOnce();
});

it("can cache with @datt/sqlitecache", async () => {
  const code = vi.fn(() => "test");
  const cache = new SQLiteCache();

  // twice in the same run
  const file1 = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, cache, hashTostring: true })
    .use(rehypeStringify)
    .process("`code` `code`");
  expect(file1.toString()).toMatchInlineSnapshot(`"<p>test test</p>"`);

  // once in different run
  const file2 = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, cache, hashTostring: true })
    .use(rehypeStringify)
    .process("`code`");
  expect(file2.toString()).toMatchInlineSnapshot(`"<p>test</p>"`);

  // but called only once instead of 3
  expect(code).toHaveBeenCalledOnce();
});

it("cache reacts to callback change", async () => {
  const cache = new Map();

  const file1 = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code: () => "1", cache, hashTostring: true })
    .use(rehypeStringify)
    .process("`code`");

  expect(file1.toString()).toMatchInlineSnapshot(`"<p>1</p>"`);

  const file2 = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code: () => "2", cache, hashTostring: true })
    .use(rehypeStringify)
    .process("`code`");

  expect(file2.toString()).toMatchInlineSnapshot(`"<p>2</p>"`);
});

it("calls hook only for given language", async () => {
  const code = vi.fn(() => undefined);

  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, language: "other" })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledTimes(0);

  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, language: "js" })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledTimes(1);
});

it("calls hook only for inline or block", async () => {
  const code = vi.fn(() => undefined);

  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, inline: true })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledTimes(0);

  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeHook, { code, inline: false })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledTimes(1);
});
