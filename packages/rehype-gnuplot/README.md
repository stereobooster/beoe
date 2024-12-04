# @dat/rehype-gnuplot

Rehype plugin to generate [Gnuplot](https://gnuplot.sourceforge.net/) diagrams in place of code fences. This:

````md
```gnuplot
plot [-10:10] sin(x)
```
````

will be converted to

```html
<figure class="beoe gnuplot">
  <svg>...</svg>
</figure>
```

which looks like this:

![example of how generated graph looks](./example.svg)

## Usage

```js
import rehypeGnuplot from "@beoe/rehype-gnuplot";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeGnuplot)
  .use(rehypeStringify)
  .process(`markdown`);
```

[Online documentation](https://beoe.stereobooster.com/diagrams/gnuplot/) provides more details.
