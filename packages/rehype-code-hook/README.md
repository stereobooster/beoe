# @beoe/rehype-code-hook

Rehype plugin to make it easier to write custom processors for code e.g.:

```html
Block-code:
<pre><code class="language-js">const x = 1;</code></pre>

Inline-code:
<code>x</code>
```

In markdown it corresponds to:

````md
Block-code:

```js
const x = 1;
```

Inline-code:
`x`
````

This plugin is usefull if you want to create rehype plugin to:

- highlight code, like `@shikijs/rehype`, `rehype-prism`, `rehype-highlight` etc.
- render diagrams, like `rehype-mermaid`
- do something else, like `rehype-color-chips`

## Usage

Basic example looks like this:

```js
import { rehypeCodeHook } from "@beoe/rehype-code-hook";
import { generateSvg } from "./generateSvg.js";

export const rehypeExampleDiagram = (options = {}) => {
  return rehypeCodeHook({
    ...options,
    code: ({ code }) => generateSvg(code),
  });
};
```

If you have code like this (it is more clear in Markdown notation, but plugin actually works at rehype level):

````md
```js {1,10}
const x = 1;
```
````

`code` callback would be called with:

```js
{
  code: "const x = 1;\n",
  inline: false,
  language: "js",
  meta: "{1,10}"
}
```

If you have code like this:

```md
`const x = 1;`
```

`code` callback would be called with:

```js
{
  code: "const x = 1;",
  inline: true,
  language: undefined,
  meta: undefined
}
```

Now it is time to render your thing:

- you can check `code`, `inline`, `language`, `meta` and if this is not the block you are looking for you can return `undefined` - and block would be unchanged
- if you decided to render something you can return `string` (for example SVG or HTML), you can return HAST fragment or you can return promise of string or HAST
  - if return value is HAST fragment it will replace whole code block
  - if return value is string it would be converted to HAST and then will replace whole code block
  - if return value is promise it will wait until it resolves and do one of steps above

You can configure your plugin to be called only for specific cases, for example:

- only for language `example`: `rehypeCodeHook({language: "example",..})`
- only for inline code: `rehypeCodeHook({inline: true,..})`

To enable caching you need to pass `Map`-like storage:

```js
rehypeCodeHook({ code, cache: new Map(), hashTostring: true });
```

I checked it with [@beoe/cache](/packages/cache/), but it suppose to work with any storage that has `Map` like interface. You may pass additional `salt` param to reset cache, for example when configuration of your plugin changed.

## Tips

### Meta string

If you need to parse `meta` param you can use, for example:

- https://github.com/Microflash/fenceparser
- https://github.com/frencojobs/fenceparser

### Astro

If you want to use rehype plugin for `code` elements in Astro you need to disable built-in highlighter and then make sure it will appear after your rehype plugin

```js
import { rehypeShiki, markdownConfigDefaults } from "@astrojs/markdown-remark";

export default defineConfig({
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      // you rehype plugin goes here
      // re-enable default Astro code highlighter
      [rehypeShiki, markdownConfigDefaults.shikiConfig],
    ],
  },
});
```

### Starlight

**Important** use v0.22+

```js
export default defineConfig({
  markdown: {
    rehypePlugins: [
      // you rehype plugin goes here
      // after you can insert code highlighter
    ],
  },
});
```

### Images instead of inline SVG

My main use-case is to inline SVGs, but if you want to produce images instead you can use [data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs). Something like this:

```js
{
  code: () =>
    `<img src="data:image/png;base64,${dataBuffer.toString("base64")}">`;
}
```

If you want to convert SVG data URL use [`mini-svg-data-uri`](https://www.npmjs.com/package/mini-svg-data-uri) or similar.

I didn't investigate how to render images aside with [vfile](https://github.com/vfile/vfile).

## TODO

- test async function and cache together
