# @beoe/remark-code-hook

Remark plugin to make it easier to write custom processors for code e.g.:

````md
Block-code:

```js
const x = 1;
```

Inline-code:
`x`
````

This plugin is usefull if you want to create remark plugin to:

- do what you would typically do at rehype level, but can't:
  - highlight code, like `@shikijs/rehype`, `rehype-prism`, `rehype-highlight` etc.
  - render diagrams, like `rehype-mermaid`
  - do something else, like `rehype-color-chips`
- do something like [obsidian-dataview](https://blacksmithgu.github.io/obsidian-dataview/)

## Usage

Basic example looks like this:

```js
import { remarkCodeHook } from "@beoe/remark-code-hook";
import { generateSvg } from "./generateSvg.js";

export const rehypeExampleDiagram = (options = {}) => {
  return remarkCodeHook({
    ...options,
    code: ({ code }) => generateSvg(code),
  });
};
```

If you have code like this:

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
- if you decided to render something you can return `string` (for example SVG or HTML), you can return MDAST fragment or you can return promise of string or MDAST
  - if return value is MDAST fragment it will replace whole code block
  - if return value is string it would be interpreted as raw-html and will replace whole code block
  - if return value is promise it will wait until it resolves and do one of steps above

You can configure your plugin to be called only for specific cases, for example:

- only for language `example`: `remarkCodeHook({language: "example",..})`
- only for inline code: `remarkCodeHook({inline: true,..})`

To enable caching you need to pass `Map`-like storage:

```js
remarkCodeHook({ code, cache: new Map(), hashTostring: true });
```

I checked it with [@beoe/cache](/packages/cache/), but it suppose to work with any storage that has `Map` like interface. You may pass additional `salt` param to reset cache, for example when configuration of your plugin changed.

## Tips

### Meta string

If you need to parse `meta` param you can use, for example:

- https://github.com/Microflash/fenceparser
- https://github.com/frencojobs/fenceparser

### Raw HTML

If you want to return raw HTML in plugin you would need to use:

- `.use(remarkRehype, { allowDangerousHtml: true })`
- `.use(rehypeRaw)`
