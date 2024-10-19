# @beoe/rehype-vizdom

Rehype plugin to generate [Vizdom](https://github.com/vizdom-dev/vizdom) diagrams (as inline SVGs) in place of code fences. This

````md
```vizdom
digraph G { Hello -> World }
```
````

will be converted to

```html
<figure class="beoe vizdom">
  <svg>...</svg>
</figure>
```

which can look like this:

**TODO**: add screenshot

## Usage

```js
import rehypeVizdom from "@beoe/rehype-vizdom";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeVizdom)
  .use(rehypeStringify)
  .process(`markdown`);
```

It support caching the same way as [@beoe/rehype-code-hook](/packages/rehype-code-hook/) does.

## Tips

### Dark mode

You can add dark mode with something like this:

```css
:root {
  --sl-color-white: #000;
  --sl-color-black: #fff;
}
@media (prefers-color-scheme: dark) {
  :root {
    --sl-color-white: #fff;
    --sl-color-black: #000;
  }
}
.vizdom {
  :not([fill]) {
    fill: var(--sl-color-white);
  }
  [fill="black"],
  [fill="#000"] {
    fill: var(--sl-color-white);
  }
  [stroke="black"],
  [stroke="#000"] {
    stroke: var(--sl-color-white);
  }
  [fill="white"],
  [fill="#fff"] {
    fill: var(--sl-color-black);
  }
  [stroke="white"],
  [stroke="#fff"] {
    stroke: var(--sl-color-black);
  }
}
```

## TODO

- [ ] figure out why SVGO removes links
- [ ] option to disable titles?
- [ ] documentation about "animation" script
  - note: animation for reverse edges
- [ ] search text in graph
  - See [text-search](https://github.com/stereobooster/facets/blob/main/notes/text-search.md#candidates)

## Notes

- Doesn't support some unicode chars, like `label="∅"`
