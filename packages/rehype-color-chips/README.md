# @datt/rehype-color-chips

Rehype plugin to add "color chips" to inline code if it is a color. This:

```md
`#bada55`
```

will be converted to:

```html
<code
  >#bada55<span class="gfm-color-chip" style="background-color:#bada55;"></span
></code>
```

which can look like this:

`#bada55` (if Github supports it).

## Status

Tried it out of curiosity (and it is kind of easy to do with `@datt/rehype-code-hook`). There are other plugins for this: [rehype-color-chips](https://github.com/shreshthmohan/rehype-color-chips).

Because it was an experiment I used all possible color variations from `validate-color` (`validateHTMLColor`, `validateHTMLColorSpecialName`, `validateHTMLColorName`), which I assume can have quite expensive Regexp. In production it is, probably, better to use cheaper checks.

## Usage

```js
import rehypeColorChips from "@datt/rehype-color-chips";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeMermaid)
  .use(rehypeColorChips)
  .process(`markdown`);
```

Don't forget to add CSS, for example:

```css
.gfm-color-chip {
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.3rem;
  display: inline-block;
  border-radius: 50%;
}
```
