---
title: Strategy
sidebar:
  order: 4
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

## Pros and cons

|                | `inline` | `data-url` | `file` |
| -------------- | -------- | ---------- | ------ |
| DOM footprint  | high     | low        | low    |
| HTML footprint | high     | high       | low    |
