# @beoe/cache

> [!WARNING]
> One of ideas was to use this as shared cache inside Astro components. But for now it doesn't work. If it is used inside Astro component build process (prerendering) fails. Though it does work in rehype/remark plugins. And in Astro components in development mode.
>
> Probably would need to create custom Astro integration (virtual module), but hard to tell because I don't understand why it fails

Thin wrapper arround [@beoe/sqlitecache](/packages/sqlitecache/) so the same cache can be shared between different rehype/remark plugins and Astro components

Because cache would be "hidden" inside other packages it exposes way to configure instance through local file (with cosmiconfig).

By default it stores cache in `node_modules/.beoe` folder. This will make it easy to use, `node_modules` often cached in CI and added to `.gitignore`. On the other hand I haven't seen this approach before, there can be downsides that I haven't thought about.

You can change where cache is stored using configuration (`beoe.config.mjs`):

```mjs
import { defineConfig } from "@beoe/cache";

export default defineConfig({
  database: "other_folder/cache.sqlite",
});
```

## Usage

```js
import { getCache } from "@beoe/cache";

const cache = await getCache();
```

## TODO

- tests
- write documentation about configuration options

## Alternatives

- [astro-build-cache](https://github.com/jcayzac/copepod-modules/tree/main/packages/astro-build-cache)
