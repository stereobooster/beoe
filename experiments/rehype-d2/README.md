# @beoe/rehype-d2

Rehype plugin to generate [d2](https://d2lang.com) diagrams (as inline SVGs) in place of code fences. This:

````md
```d2
x -> y: hello world
```
````

will be converted to

```html
<figure class="beoe d2">
  <svg>...</svg>
</figure>
```

which can look like this:

<img width="" height="" src="./example.svg" alt="example of how generated diagram looks">

## Usage

You need to install Java and Graphviz in order to use this plugin.

```js
import rehypeD2 from "@beoe/rehype-d2";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeD2)
  .use(rehypeStringify)
  .process(`markdown`);
```

It support caching the same way as [@beoe/rehype-code-hook](/packages/rehype-code-hook/) does.