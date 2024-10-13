# @beoe/rehype-vizdom

> [!WARNING]
> Not published

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
import rehypeGraphviz from "@beoe/rehype-vizdom";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeGraphviz)
  .use(rehypeStringify)
  .process(`markdown`);
```

It support caching the same way as [@beoe/rehype-code-hook](/packages/rehype-code-hook/) does.

## Tips

### Styling and dark mode

You can add dark mode with something like this:

```css
:root {
  --color-variable: #000;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-variable: #fff;
  }
}
.vizdom {
  text {
    fill: var(--color-variable);
  }
  [fill="black"] {
    fill: var(--color-variable);
  }
  [stroke="black"] {
    stroke: var(--color-variable);
  }
}
```

Plus you can pass [class](https://vizdom.org/docs/attrs/class/) to Edges and Nodes to implement advanced styling.

### Transparent background

To remove background use:

```vizdom
digraph G {
 bgcolor="transparent"
}
```

### To remove title

To remove `title` (which shows as tooltip when you hover mouse) use:

```vizdom
digraph G {
 node[tooltip=" "]
}
```

### You can add links

Inline SVG can contain HTML links:

```vizdom
digraph G {
 node[URL="https://example.com"]
}
```

## TODO

- [ ] Test with all examples from https://vizdom.dev/editor/view
- [ ] add a way to pass "Layout Settings"
- [ ] update readme
