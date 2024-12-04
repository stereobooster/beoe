---
title: Configuration
sidebar:
  order: 4
---

All Rehype diagram plugins support (at least) following configurations:

- [`strategy`](/start-here/strategy/) (optional). Default `inline`
- [`darkScheme`](/start-here/dark-scheme/) (optional). Default `undefined`
- `cache` (optional) - Map-like storage to speed up consequent renders of page. You can use standard JS `Map`, but probably it is better to use [@beoe/cache](https://github.com/stereobooster/beoe/tree/main/packages/cache/).
- `class` (optional) - allows to setup additional classes for diagrams. For example, `.not-content` for inline diagrams if you use [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)
- `svgo` (optional) - options for [SVGO](https://github.com/svg/svgo). Use `false` to disable optimization with SVGO

All configurations can be set either globally or locally (via fence-code meta). Global configurations applies to all diagrams. Local configurations applies only to one diagram. Local configurations always override global, with exception for `class` option (it applies all provided classes).

Also you won't be able to set `cache` and `svgo` via local configurations, except disabling them with `false` value.

## Global configuration

For example,

```js
import { getCache } from "@beoe/cache";
const cache = await getCache();

use(rehypeDiagram, {
  strategy: "file",
  darkScheme: "class",
  class: "something",
  cache,
});
```

## Local configuration

````md
```some-diagram strategy=inline darkScheme=false class=interactive
...
```
````
