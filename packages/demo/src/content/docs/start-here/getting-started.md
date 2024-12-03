---
title: Getting started
sidebar:
  order: 1
---

## TODO

- [ ] documentation about shared options
  - `strategy`
  - `darkScheme`
  - `cache`
  - `class`
  - `svgo`
- [ ] documentation about meta
  - `strategy`, `class`
  - `alt` (not implemented yet)
- [ ] documentation and examples about interactivity
- [ ] tips about styles and other things
- [ ] publish new version

## Basic

Basic idea. You have Markdown like this:

````md
```some-diagram
diagram text
```
````

..and you will get an output like this:

```html
<svg>...</svg>
```

or

```html
<img src="..." />
```

Diagrams can be embedded in HTML differently, each with its own advantages and trade-offs. [Read more here](/start-here/strategy/)

### Usage

```js
import rehypeDiagram from "@beoe/rehype-some-diagram";

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDiagram, {
    /* options here */
  })
  .use(rehypeStringify)
  .process(`markdown`);
```

## Packages included

### Base

- [@beoe/rehype-code-hook](https://github.com/stereobooster/beoe/tree/main/packages/rehype-code-hook/)
- [@beoe/sqlitecache](https://github.com/stereobooster/beoe/tree/main/packages/sqlitecache/)
- [@beoe/cache](https://github.com/stereobooster/beoe/tree/main/packages/cache/)
- [@beoe/remark-code-hook](https://github.com/stereobooster/beoe/tree/main/packages/remark-code-hook/)
- [@beoe/pan-zoom](https://github.com/stereobooster/beoe/tree/main/packages/pan-zoom/)
- [@beoe/fenceparser](https://github.com/stereobooster/beoe/tree/main/packages/fenceparser/)

### Diagrams

- [@beoe/rehype-graphviz](https://github.com/stereobooster/beoe/tree/main/packages/rehype-graphviz/)
- [@beoe/rehype-mermaid](https://github.com/stereobooster/beoe/tree/main/packages/rehype-mermaid/)
- [@beoe/rehype-gnuplot](https://github.com/stereobooster/beoe/tree/main/packages/rehype-gnuplot/)
- [@beoe/rehype-vizdom](https://github.com/stereobooster/beoe/tree/main/packages/rehype-vizdom/)
- [@beoe/rehype-d2](https://github.com/stereobooster/beoe/tree/main/packages/rehype-d2/)
