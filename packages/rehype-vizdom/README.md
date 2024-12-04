# @beoe/rehype-vizdom

Rehype plugin to generate [Vizdom](https://github.com/vizdom-dev/vizdom) diagrams in place of code fences. This

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

[Online documentation](https://beoe.stereobooster.com/diagrams/vizdom/) provides more details.
