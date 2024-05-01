# @datt/cache

Thin wrapper arround [@datt/sqlitecache](/packages/sqlitecache/) so the same cache can be shared between different rehype/remark plugins and Astro components

Because cache would be "hidden" inside other packages it exposes way to configure instance through local file (with cosmiconfig).

By default it stores cache in `.datt` folder. Add this folder to `.gitignore` or you can change where cache is stored using configuration (`datt.config.mjs`):

```mjs
import { defineConfig } from "@datt/cache";

export default defineConfig({
  database: "node_modules/datt_cache.sqlite",
});
```

## Usage

```js
import { getCache } from "@datt/cache";

const cache = await getCache();
```

## TODO

- tests
- write documentation about configuration options
