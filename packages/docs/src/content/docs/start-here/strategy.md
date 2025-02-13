---
title: Strategy
sidebar:
  order: 2
---

Global configuration:

```js
use(rehypeDiagram, {
  strategy: "...", // one of 3 options
});
```

**or** local configuration

````md
```some-diagram strategy=...
diagram text
```
````

`inline` is a default option.

## Options

### `inline`

```html
<figure class="beoe"><svg>...</svg></figure>
```

### `data-url`

```html
<figure class="beoe">
  <img src="data:image/svg+xml,..." width="..." height="..." />
</figure>
```

### `file`

```html
<figure class="beoe">
  <img src="/path/to.svg" width="..." height="..." />
</figure>
```

**Note**: this strategy requires two additional options:

```js
use(rehypeDiagram, {
  strategy: "file",
  // where to store files on the disk
  fsPath: "public/beoe",
  // path to files in a browser
  webPath: "/beoe",
});
```

add `fsPath` (`public/beoe`) to `.gitignore`

**Note**: if you deploy to Netlify, do not use path that starts with `.`.

**Note**:

> External resources (e.g. images, stylesheets) cannot be loaded, though they can be used if inlined through `data:` URLs.
>
> [SVG as an Image Restrictions](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_as_an_Image#restrictions)

### `iframe`

`iframe` is the new idea. **Not implemented**

```html
<figure class="beoe">
  <iframe src="/path/to.svg" width="..." height="..." title="..."></iframe>
</figure>
```

**Note**: this strategy requires two additional options:

```js
use(rehypeDiagram, {
  strategy: "iframe",
  // where to store files on the disk
  fsPath: "public/beoe",
  // path to files in a browser
  webPath: "/beoe",
});
```

add `fsPath` (`public/beoe`) to `.gitignore`

**Note**: if you deploy to Netlify, do not use path that starts with `.`.

**Note**:

- there is issue with navigation of top frame: links need `target=_top`, iframe maybe needs `allow-top-navigation`
- link preview won't work
- there are issues with `@beoe/pan-zoom`: gestures doesn't work, buttons work though
- there is also `allowfullscreen`

## Pros and cons

|                                                         | `inline`     | `data-url` | `file` | `iframe` (1)  |
| ------------------------------------------------------- | ------------ | ---------- | ------ | ------------- |
| [Interactivity](/start-here/interactivity/)             | yes          | no         | no     | probably yes  |
| [Can be styled with CSS](/start-here/styling-with-css/) | yes          | no         | no     | no            |
| CSS conflicts                                           | probably yes | no         | no     | no            |
| [`<img alt="..." >`](/start-here/accessibility/)        | no           | yes        | yes    | yes (`title`) |
| DOM footprint                                           | high         | low        | low    | low           |
| HTML footprint                                          | high         | high       | low    | low           |

1: `iframe` is the new idea. **Not implemented**
