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

### Add CSS class to diagram

You have two options:

- either globally
  ```js
  .use(rehypeVizdom, { class: "something" })
  ```
- or locally
  ````md
  ```vizdom class=something
  digraph G { Hello -> World }
  ```
  ````

### Rounded corners for rectangles

1. Disable `svgo` or provide your own configuration with `convertShapeToPath: false`
   - either globally
     ```js
     .use(rehypeVizdom, { svgo: false })
     ```
   - or locally
     ````md
     ```vizdom svgo=false
     digraph G { Hello -> World }
     ```
     ````
2. Add CSS
   ```css
   .vizdom {
     .node rect {
       rx: 7px;
     }
   }
   ```

### Client side interactivity

1. Set option to generate `data-graph` HTML attribute
   - either globally
     ```js
     .use(rehypeVizdom, { datagraph: 'dagre' })
     ```
   - or locally
     ````md
     ```vizdom datagraph=dagre
     digraph G { Hello -> World }
     ```
     ````
2. Add JS

   ```ts
   import { json, alg, type Path } from "@dagrejs/graphlib";

   type D = { [node: string]: Path };

   document.querySelectorAll(".vizdom").forEach((container) => {
     const data = container.getAttribute("data-graph")
       ? JSON.parse(container.getAttribute("data-graph")!)
       : null;

     if (!data) return;
     const graph = json.read(data);

     function clear() {
       container.querySelectorAll(".node").forEach((node) => {
         node.classList.remove("active");
         node.classList.remove("selected");
       });
       container
         .querySelectorAll(".edge")
         .forEach((node) => node.classList.remove("active"));
     }

     function highlight(id: string) {
       alg.postorder(graph, [id]).forEach((node) => {
         container.querySelector(`#node-${node}`)?.classList.add("active");
         graph.outEdges(node)?.forEach(({ name }) => {
           container.querySelector(`#edge-${name}`)?.classList.add("active");
         });
       });
     }

     // highlight on hover
     let currentHover: string | null = null;
     container.addEventListener("mouseover", (e) => {
       // @ts-expect-error
       const node = e.target?.closest(".node");
       if (node) {
         const id = node.getAttribute("id").replace("node-", "");
         if (currentHover == id) return;
         clear();
         highlight(id);
         currentHover = id;
       } else {
         if (currentHover == null) return;
         clear();
         currentHover = null;
       }
     });
   });
   ```

3. Add CSS

   ```css
   @keyframes dash {
     from {
       stroke-dashoffset: 40;
     }
     to {
       stroke-dashoffset: 0;
     }
   }
   .vizdom[data-graph] {
     .edge.active a path:first-child {
       stroke-dasharray: 5 5;
       animation-name: dash;
       animation-duration: 1000ms;
       stroke-dashoffset: 0;
       animation-iteration-count: infinite;
       animation-timing-function: linear;
     }

     .node {
       cursor: pointer;
     }

     .node.selected a *:first-child {
       stroke-width: 2px;
     }
   }

   @media (prefers-reduced-motion) {
     .vizdom[data-graph] {
       .edge.active a path:first-child {
         animation-duration: 4000ms;
       }
     }
   }
   ```

## Notes

- Text is transformed to path, so <kbd>Cmd</kbd> + <kbd>F</kbd> doesn't work
  - alternatively one can generate JSON representation of graph and search through labels with [text-search](https://github.com/stereobooster/facets/blob/main/notes/text-search.md#candidates)
- Doesn't support some unicode chars, like `label="∅"`
- Client-side JS library
  - graphology is about 70kb uncompressed
  - `@dagrejs/graphlib` is about 12kb
  - [graph-data-structure](https://www.npmjs.com/package/graph-data-structure) is about 4kb (but it doesn't support ids for edges)
  - [DirectedGraph](https://data-structure-typed-docs.vercel.app/classes/DirectedGraph.html) is about 40kb
  - [Other options](https://www.npmjs.com/search?q=graph-theory)
