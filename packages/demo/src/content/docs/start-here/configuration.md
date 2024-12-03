---
title: Configuration
sidebar:
  order: 4
---

All Rehype diagram plugins support (at least) following configurations:

- `cache` (optional) - Map-like storage to speed up consequent renders of page. You can use standard JS `Map`, but probably it is better to use [@beoe/cache](https://github.com/stereobooster/beoe/tree/main/packages/cache/).
- `class` (optional) - allows to setup additional classes for diagrams. For example, `.not-content` for inline diagrams if you use [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)
- `svgo` (optional) - options for [SVGO](https://github.com/svg/svgo). Use `false` to disable optimization with SVGO
- [`strategy`](/start-here/strategy/) (optional). Default `inline`
- [`darkScheme`](/start-here/dark-scheme/) (optional). Default `undefined`

All configurations can be set either globally or locally (via fence-code meta). Global configurations applies to all diagrams. Local configurations applies only to one diagram. Local configurations always override global, with exception for `class` option (it applies all provided classes).

Also you want be able to set `cache` and `svgo` via local configurations, excpet disabling them with `false` value.

## Global configurations

For example,

```js
import { getCache } from "@beoe/cache";
const cache = await getCache();

use(rehypeDiagram, {
  strategy: "file",
  darkTheme: "class",
  class: "not-content",
  cache,
});
```

## Local configurations

````md
```some-diagram strategy=inline darkTheme=false class=interactive
...
```
````

## Other configurations

Often plugins would have additional options, for example, D2 also has `d2Options`

```js
import { getCache } from "@beoe/cache";
const cache = await getCache();

use(rehypeD2, {
  d2Options: { pad: 20 },
});
```

````md
```d2 pad=50
...
```
````
