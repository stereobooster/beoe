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

**or** for each diagram separately

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

## Pros and cons

|                        | `inline`     | `data-url` | `file` |
| ---------------------- | ------------ | ---------- | ------ |
| Interactivity          | possible     | no         | no     |
| CSS conflicts          | probably yes | no         | no     |
| Can be styled with CSS | yes          | no         | no     |
| DOM footprint          | high         | low        | low    |
| HTML footprint         | high         | high       | low    |

:::caution
WIP
:::

- **cons**
  - CSS conflicts
    - CSS from website can affect diagram
      - potential solution `.not-content`
    - CSS from diagram can affect website (d2 diagrams)
      - this can break dark theme or other diagrams on the same page
      - potential solution use unique prefix to make sure there is no clash
  - Dark theme can be limited (black and white)

