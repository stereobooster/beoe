# @datt/astro-graphviz

Astro component to generate [Graphviz](https://graphviz.org/) diagrams as inline SVG.

It uses [@datt/cache](/packages/cache/)

## Uage

In MDX or Astro:

```mdx
import { Graphviz } from "@datt/astro-graphviz";

<Graphviz
  code={`digraph finite_state_machine {
  	bgcolor="transparent";
    start -> end
}`}
/>
```

It also provides rehype plugin (re-exports [@datt/rehype-graphviz](/packages/rehype-graphviz/)) with cache preconfigured:

```js
import { rehypeGraphviz } from "@datt/astro-graphviz/rehype";

// https://astro.build/config
export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeGraphviz],
  },
});
```

## Tips

See [@datt/rehype-graphviz](/packages/rehype-graphviz/)

## TODO

- add type declarations for `@datt/astro-graphviz/rehype`
