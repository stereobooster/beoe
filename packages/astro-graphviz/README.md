# @beoe/astro-graphviz

Astro component to generate [Graphviz](https://graphviz.org/) diagrams as inline SVG.

## Uage

In MDX or Astro:

```mdx
import { Graphviz } from "@beoe/astro-graphviz";

<Graphviz
  code={`digraph finite_state_machine {
  	bgcolor="transparent";
    start -> end
}`}
/>
```

It also provides rehype plugin (re-exports [@beoe/rehype-graphviz](/packages/rehype-graphviz/)) with cache preconfigured:

```js
import { rehypeGraphviz } from "@beoe/astro-graphviz/rehype";

// https://astro.build/config
export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeGraphviz],
  },
});
```

## Tips

See [@beoe/rehype-graphviz](/packages/rehype-graphviz/)

## TODO

- use `@beoe/cache` in Astro component
- add type declarations for `@beoe/astro-graphviz/rehype`
