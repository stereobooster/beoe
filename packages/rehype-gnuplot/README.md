# @dat/rehype-gnuplot

Rehype plugin to generate [Gnuplot](https://gnuplot.sourceforge.net/) diagrams (as inline SVGs) in place of code fences. This:

````md
```gnuplot
plot [-10:10] sin(x)
```
````

will be converted to

```html
<figure class="datt gnuplot">
  <svg>...</svg>
</figure>
```

which looks like this:

![example of how generated graph looks](./example.svg)

## Usage

```js
import rehypeGnuplot from "@datt/rehype-gnuplot";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeGnuplot)
  .use(rehypeStringify)
  .process(`markdown`);
```

It support caching the same way as [@datt/rehype-code-hook](/packages/rehype-code-hook/) does.

## Tips

### XKCD-style

You can create XKCD-style plots with this [snippet](https://rfonseca.github.io/xkcd-gnuplot/). In order for it to work as SVG you need to changed following lines:

```diff
- set term postscript eps font 'HumorSans' fontfile 'Humor-Sans.pfa' 22
- set output 'xkcd.eps'
+ set terminal svg enhanced font "HumorSans,Patrick Hand,Chalkboard,Comic Sans MS,18"
```

You may use any font you like (don't forget to load it in HTML), for example:

- [Humor Sans](https://github.com/shreyankg/xkcd-desktop/blob/master/Humor-Sans.ttf)
- [Patrick Hand](https://fonts.google.com/specimen/Patrick+Hand)
