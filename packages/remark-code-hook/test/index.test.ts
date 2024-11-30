import fs from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { expect, it, vi } from "vitest";

import { remerkCodeHook } from "../src/index.js";
// it's ok to use direct import in test use file directly
import { SQLiteCache } from "../../sqlitecache/src/index.js";

/*
| ........................ process ........................... |
| .......... parse ... | ... run ... | ... stringify ..........|

          +--------+                     +----------+
Input ->- | Parser | ->- Syntax Tree ->- | Compiler | ->- Output
          +--------+          |          +----------+
                              X
                              |
                       +--------------+
                       | Transformers |
                       +--------------+  
*/

it("doesn't work at parse level", async () => {
  const processor = unified()
    .use(remarkParse)
    .use(remerkCodeHook, {
      code: () => ({ type: "text", value: "ABC" }),
    });

  const ast = processor.parse(
    await fs.readFile(new URL("./fixtures/a.md", import.meta.url))
  );

  expect(ast).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "lang": "js",
          "meta": "{3-4} fileName=test /a/",
          "position": {
            "end": {
              "column": 4,
              "line": 3,
              "offset": 38,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "code",
          "value": "test",
        },
      ],
      "position": {
        "end": {
          "column": 1,
          "line": 4,
          "offset": 39,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

it("works at transformation level", async () => {
  const processor = unified()
    .use(remarkParse)
    .use(remerkCodeHook, {
      code: () => ({ type: "text", value: "ABC" }),
    });

  const ast = processor.parse(
    await fs.readFile(new URL("./fixtures/a.md", import.meta.url))
  );

  const astAfter = await processor.run(ast);

  expect(astAfter).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "type": "text",
          "value": "ABC",
        },
      ],
      "position": {
        "end": {
          "column": 1,
          "line": 4,
          "offset": 39,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

it("does nothing if code returns undefined", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, {
      code: () => undefined,
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  await expect(file.toString()).toMatchFileSnapshot("./fixtures/a1.out.html");
});

it("supports html strings", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, {
      code: () => "<b>html</b>",
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  await expect(file.toString()).toMatchFileSnapshot("./fixtures/a2.out.html");
});

it("supports mdast", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, {
      code: () => ({ type: "text", value: "Alpha bravo charlie." }),
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  await expect(file.toString()).toMatchFileSnapshot("./fixtures/a3.out.html");
});

it("supports promises with undefined", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, {
      code: () => Promise.resolve(undefined),
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  await expect(file.toString()).toMatchFileSnapshot("./fixtures/a1.out.html");
});

it("supports promises with html string", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, {
      code: () => Promise.resolve("<b>html</b>"),
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  await expect(file.toString()).toMatchFileSnapshot("./fixtures/a2.out.html");
});

it("supports promises with mdast", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, {
      code: () =>
        Promise.resolve({ type: "text", value: "Alpha bravo charlie." }),
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  await expect(file.toString()).toMatchFileSnapshot("./fixtures/a3.out.html");
});

it("passes props to callback for code-block", async () => {
  const code = vi.fn(() => undefined);

  const file = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledWith({
    code: "test",
    inline: false,
    language: "js",
    meta: "{3-4} fileName=test /a/",
  });
});

it("passes props to callback for code-inline", async () => {
  const code = vi.fn(() => undefined);

  const file = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code })
    .use(remarkRehype)
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
      .use(remerkCodeHook, {
        code: () => {
          throw new Error("whatever");
        },
      })
      .use(remarkRehype)
      .use(rehypeStringify)
      .process("`test`")
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[1:1-1:7: whatever]`);
});

it("passes error and adds location in markdown", async () => {
  await expect(() =>
    unified()
      .use(remarkParse)
      .use(remerkCodeHook, {
        code: () => Promise.reject(new Error("whatever")),
      })
      .use(remarkRehype)
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
    .use(remerkCodeHook, { code, cache, hashTostring: true })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process("`code` `code`");
  expect(file1.toString()).toMatchInlineSnapshot(
    `"<p><code>code</code> <code>code</code></p>"`
  );

  // once in different run
  const file2 = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code, cache, hashTostring: true })
    .use(remarkRehype)
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
    .use(remerkCodeHook, { code, cache, hashTostring: true })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process("`code` `code`");
  expect(file1.toString()).toMatchInlineSnapshot(`"<p> </p>"`);

  // once in different run
  const file2 = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code, cache, hashTostring: true })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process("`code`");
  expect(file2.toString()).toMatchInlineSnapshot(`"<p></p>"`);

  // but called only once instead of 3
  expect(code).toHaveBeenCalledOnce();
});

it("can cache with @beoe/sqlitecache", async () => {
  const code = vi.fn(() => "test");
  const cache = new SQLiteCache();

  // twice in the same run
  const file1 = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code, cache, hashTostring: true })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process("`code` `code`");
  expect(file1.toString()).toMatchInlineSnapshot(`"<p> </p>"`);

  // once in different run
  const file2 = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code, cache, hashTostring: true })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process("`code`");
  expect(file2.toString()).toMatchInlineSnapshot(`"<p></p>"`);

  // but called only once instead of 3
  expect(code).toHaveBeenCalledOnce();
});

it("cache reacts to callback change", async () => {
  const cache = new Map();

  const file1 = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code: () => "1", cache, hashTostring: true })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process("`code`");

  expect(file1.toString()).toMatchInlineSnapshot(`"<p></p>"`);

  const file2 = await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code: () => "2", cache, hashTostring: true })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process("`code`");

  expect(file2.toString()).toMatchInlineSnapshot(`"<p></p>"`);
});

it("calls hook only for given language", async () => {
  const code = vi.fn(() => undefined);

  await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code, language: "other" })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledTimes(0);

  await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code, language: "js" })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledTimes(1);
});

it("calls hook only for inline or block", async () => {
  const code = vi.fn(() => undefined);

  await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code, inline: true })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledTimes(0);

  await unified()
    .use(remarkParse)
    .use(remerkCodeHook, { code, inline: false })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await fs.readFile(new URL("./fixtures/a.md", import.meta.url)));

  expect(code).toHaveBeenCalledTimes(1);
});
