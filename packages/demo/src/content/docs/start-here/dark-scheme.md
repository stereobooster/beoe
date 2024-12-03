---
title: Dark scheme
sidebar:
  order: 3
---

Global configuration:

```js
use(rehypeDiagram, {
  darkScheme: "...", // one of 2 options
});
```

**or** for each diagram separately

````md
```some-diagram darkScheme=...
diagram text
```
````

**none** is a default option.

## Options

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

You would need to add CSS, something like this:

```css
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

|            | `class`   | `media` |
| ---------- | --------- | ------- |
| `inline`   | maybe (1) | no      |
| `data-url` | yes       | yes     |
| `file`     | yes       | yes     |

(1) - for example, works for Mermaid, but doesn't work for D2