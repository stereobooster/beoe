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

**Note**: this strategy requires to additional options:

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

### `iframe`

`iframe` is the new idea. **Not implemented**

```html
<figure class="beoe">
  <iframe src="/path/to.svg" width="..." height="..." title="..."></iframe>
</figure>
```

**Note**: this strategy requires to additional options:

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

- there is also `allowfullscreen`, `loading=lazy`, `role=img`
- I wonder if there will be issues with fitting image or if it would allow navigation of top frame
  - `target=_top` + `allow-top-navigation`
- link preview won't work
- maybe there will be issues with `@beoe/pan-zoom`

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
