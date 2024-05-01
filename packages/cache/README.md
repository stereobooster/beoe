# @beoe/cache

Thin wrapper arround [@beoe/sqlitecache](/packages/sqlitecache/) so the same cache can be shared between different rehype/remark plugins and Astro components

Because cache would be "hidden" inside other packages it exposes way to configure instance through local file (with cosmiconfig).

By default it stores cache in `.beoe` folder. Add this folder to `.gitignore` or you can change where cache is stored using configuration (`beoe.config.mjs`):

```mjs
import { defineConfig } from "@beoe/cache";

export default defineConfig({
  database: "node_modules/datt_cache.sqlite",
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
