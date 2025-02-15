---
title: Tag
sidebar:
  order: 2
---

Global configuration:

```js
use(rehypeDiagram, {
  tag: "...", // one of 3 options
});
```

**or** local configuration

````md
```some-diagram tag=...
diagram text
```
````

`img` is a default option. Ignored for `strategy=inline`

## Options

### `img`

```html
<figure class="beoe"><img src="..." width="..." height="..." /></figure>
```

### `iframe`

```html
<figure class="beoe">
  <iframe src="..." width="..." height="..." title="..."></iframe>
</figure>
```

**Note**: there is also `allowfullscreen`.

### `embed`

```html
<figure class="beoe">
  <embed src="..." width="..." height="..." title="..."></embed>
</figure>
```

## Strategy vs Tag

|                   | [`inline`](/start-here/strategy/#inline) | [`data-url`](/start-here/strategy/#data-url) | [`file`](/start-here/strategy/#file) |
| ----------------- | ---------------------------------------- | -------------------------------------------- | ------------------------------------ |
| `svg` (1)         | **yes** (only possible option)           | no                                           | no                                   |
| `img`             | no                                       | **yes** (default)                            | **yes** (default)                    |
| `iframe`, `embed` | no                                       | yes                                          | yes                                  |

- (1) not an actual option

## Pros and cons

|                                                                                         | `svg` ([`inline`](/start-here/strategy/#inline)) | `img`                | `iframe` or `embed`  |
| --------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------- | -------------------- |
| [Searchable text](/start-here/interactivity/#searchable-text)                           | yes                                              | no                   | yes                  |
| [Links](/start-here/interactivity/#links)                                               | yes                                              | no                   | yes with caveats (1) |
| [Interactivity with JS](/start-here/interactivity/#progressive-enhancement-with-js) (2) | yes                                              | no                   | yes with caveats (3) |
| [Can be styled with CSS](/start-here/styling-with-css/)                                 | yes                                              | no                   | no                   |
| CSS conflicts                                                                           | possible                                         | no                   | no                   |
| [`alt="..."` or `title="..."`](/start-here/accessibility/)                              | no                                               | yes                  | yes                  |
| Embedded images and fonts                                                               | yes                                              | yes with caveats (4) | yes                  |
| `@beoe/pan-zoom`                                                                        | yes                                              | yes                  | yes with caveats (5) |

- (1) Links require `target=_top`, iframe may require `allow-top-navigation`
- (2) This includes [link previews](https://astro-digital-garden.stereobooster.com/recipes/link-previews/)
- (3) It is possible to access `iframe` content via JS, but I suspect it will have issues
  - with [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
  - `embed`, it seems, doesn't have `DOM`
  - there probably will be issues with `@floating-ui/dom`
- (4) [Work only if images inlined (via `data-url`)](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_as_an_Image#restrictions)
- (5) gestures don't work (at least in the current implementation), buttons work though
