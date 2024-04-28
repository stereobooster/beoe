# @datt/rehype-mermaid

Rehype plugin to generate [Mermaid](https://mermaid.js.org/) diagrams (as inline SVGs) in place of code fences. This:

````md
```mermaid
flowchart LR
  start --> stop
```
````

will be converted to

```html
<div class="datt mermaid">
  <svg>...</svg>
</div>
```

which looks like this:

```mermaid
flowchart LR
  start --> stop
```

## How is it different from `rehype-mermaid`?

There is battle-tested and well maintained [rehype-mermaid](https://github.com/remcohaszing/rehype-mermaid). Both plugins use the same [mermaid-isomorphic](https://github.com/remcohaszing/mermaid-isomorphic) behind the scene.

Main **difference** is that this plugin supports cache, but less teted. Also it supports only "inline-svg" strategy - rehype-mermaid's default strategy.

## Usage

```js
import rehypeMermaid from "@datt/rehype-mermaid";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeMermaid)
  .use(rehypeStringify)
  .process(`markdown`);
```

It support caching the same way as [@datt/rehype-code-hook](/packages/rehype-code-hook/) does.

## TODO

- maybe use `waitFor`
- maybe remove `style="max-width: ..."`
- test `mermaid-isomorphic` options (`css, mermaidConfig, prefix, browser, launchOptions`)
