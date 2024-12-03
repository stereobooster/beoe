# @beoe/rehype-mermaid

Rehype plugin to generate [Mermaid](https://mermaid.js.org/) diagrams in place of code fences. This:

````md
```mermaid
flowchart LR
  start --> stop
```
````

will be converted to

```html
<figure class="beoe mermaid">
  <svg>...</svg>
</figure>
```

which can look like this:

```mermaid
flowchart LR
  start --> stop
```

## How is it different from `rehype-mermaid`?

There is battle-tested and well maintained [rehype-mermaid](https://github.com/remcohaszing/rehype-mermaid). Both plugins use the same [mermaid-isomorphic](https://github.com/remcohaszing/mermaid-isomorphic) behind the scene.

Main **difference** is that this plugin supports cache, but less teted.

## Usage

```js
import rehypeMermaid from "@beoe/rehype-mermaid";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeMermaid)
  .use(rehypeStringify)
  .process(`markdown`);
```

It support caching the same way as [@beoe/rehype-code-hook](/packages/rehype-code-hook/) does.

## Tips

### Playwright

You need to install `playwright` as well. Also you probably need something like this:

```json
"scripts": {
  "postinstall": "playwright install chromium"
}
```

## TODO

- write about dark mode
