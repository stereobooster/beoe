# @datt/rehype-starry-night

Rehype plugin to highlight code with the help of [starry-night](https://github.com/wooorm/starry-night). This:

````md
```markdown
# Hello, world!
```
````

will be converted to:

```html
<pre><code class="language-markdown"><span class="pl-mh"><span class="pl-mh">#</span><span class="pl-mh"> </span>Hello, world!</span></code></pre>
```

which can look like this:

```markdown
# Hello, world!
```

## Status

Tried it out of curiosity (and it is kind of easy to do with `@datt/rehype-code-hook`). There are other plugins that has better support, for example [`@shikijs/rehype`](https://shiki.matsu.io/packages/rehype).

## Usage

```js
import rehypeStarryNight from "@datt/rehype-starry-night";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeMermaid)
  .use(rehypeStarryNight)
  .process(`markdown`);
```

Don't forget to add CSS, for example:

```html
<link
  rel="stylesheet"
  href="https://esm.sh/@wooorm/starry-night@3/style/both.css"
/>
```
