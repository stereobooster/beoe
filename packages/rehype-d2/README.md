# @beoe/rehype-d2

Rehype plugin to generate [d2](https://d2lang.com) diagrams in place of code fences. This:

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

<img width="74" height="255" src="./example.svg" alt="example of how generated diagram looks">

## Usage

```js
import rehypeD2 from "@beoe/rehype-d2";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeD2)
  .use(rehypeStringify)
  .process(`markdown`);
```

[Online documentation](https://beoe.stereobooster.com/diagrams/d2/) provides more details.
