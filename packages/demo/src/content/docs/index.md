---
title: Diagram All The Things
---

## Strategies

### inline

- **pros**
  - interactivity
    - links (`a href`)
    - <Kbd>Cmd</kbd> + <Kbd>F</kbd>
    - with JS, for example, if we inline JSON data
    - need to be careful with SVGO to not remove IDs etc.
  - dark theme
    - class based
    - `prefers-color-scheme`
    - allows to add dark theme to tools that don't support it out of the box (`graphviz`, `vizdom`, `gnuplot`)
- **cons**
  - CSS conflicts
    - CSS from website can affect diagram
      - potential solution `.not-content`
    - CSS from diagram can affect website (d2 diagrams)
      - this can break dark theme or other diagrams on the smae page
      - potential solution use unique prefix to make sure there is no clash
  - Dark theme can be limited (black and white)
  - DOM footprint
  - easy to integrate, especially if there is no inline CSS in SVG

### data-url

- **pros**
  - no CSS conflicts
  - dark theme
    - class based. Two images with two classes and only one shown at a time depending on the theme
    - `prefers-color-scheme`: `picture` + `source media="(prefers-color-scheme: dark)` + `img`
  - no DOM footprint
- **cons**
  - no interactivity
  - no DOM footprint, but overall weight of HTML is high as in previous strategy
  - easy to integrate - only need to add a bit of CSS to support dark theme

### file

- **pros**
  - no CSS conflicts
  - dark theme
    - class based. Two images with two classes and only one shown at a time depending on the theme
    - `prefers-color-scheme`: `picture` + `source media="(prefers-color-scheme: dark)` + `img`
  - no DOM footprint
  - lighter weight of HTML compared to previous strategy
- **cons**
  - no interactivity
  - some tools don't support dark theme out of the box (`graphviz`, `vizdom`, `gnuplot`)
  - harder to integrate - need to resolve where to write file, how to do cache busting...

---

# TODO

## Strategy

### `inline`

**Default strategy**.

```html
<figure class="beoe"><svg>...</svg></figure>
```

### `data-url`

```html
<figure class="beoe">
  <img src="data:image/svg+xml,..." width="..." height="..." alt="..." />
</figure>
```

### `file`

```html
<figure class="beoe">
  <img src="/path/to.svg" width="..." height="..." alt="..." />
</figure>
```

## Dark scheme

### none

**Default**.

```html
<figure class="beoe">only one image</figure>
```

### `class`

```html
<figure class="beoe">
  <div>
    <img class="beoe-light" src="..." />
    <img class="beoe-dark" src="..." />
  </div>
</figure>
```

You would need to add CSS, something like this

```CSS
html[data-theme="light"] .beoe-dark {
  display: none;
}

html[data-theme="dark"] .beoe-light {
  display: none;
}
```

### `media`

```html
<figure class="beoe">
  <picture>
    <img src="..." />
    <source media="(prefers-color-scheme: dark)" src="..." />
  </picture>
</figure>
```

## Strategy vs dark scheme

|            | `class` | `media` |
| ---------- | ------- | ------- |
| `inline`   | maybe   | no      |
| `data-url` | yes     | yes     |
| `file`     | yes     | yes     |

## Strategy pros and cons

|                        | `inline`     | `data-url` | `file` |
| ---------------------- | ------------ | ---------- | ------ |
| Interactivity          | possible     | no         | no     |
| CSS conflicts          | probably yes | no         | no     |
| Can be styled with CSS | yes          | no         | no     |
| DOM footprint          | high         | low        | low    |
| HTML footprint         | high         | high       | low    |

## Interactivity

- Links (`<a href="...">`)
- Search text in the diagram (<Kbd>Cmd</kbd> + <Kbd>F</kbd>)
- With JS, for example, if we inline JSON data
