import { cosmiconfig } from "cosmiconfig";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { cwd } from "node:process";

import { type SQLiteCacheOptions } from "@beoe/sqlitecache";

export type MapLike<K = any, V = any> = {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
};

export type Config = SQLiteCacheOptions & {
  // in case you don't want to use built-in SQLiteCache
  override?: MapLike;
};

// For inspiration https://github.com/vitejs/vite/blob/main/packages/vite/src/node/config.ts
// can also add validation https://stereobooster.com/posts/runtime-type-validators/
export function defineConfig(cfg: Config) {
  return cfg;
}

const moduleName = "beoe";
const explorer = cosmiconfig(moduleName, {
  searchPlaces: [
    // "package.json",
    `${moduleName}.config.js`,
    `${moduleName}.config.ts`,
    `${moduleName}.config.mjs`,
    `${moduleName}.config.cjs`,
  ],
});

export async function getConfig() {
  const defaultCfg: Config = {
    database: join(cwd(), "node_modules/.beoe/cache.sqlite"),
    maxItems: 1024,
  };

  let cfg: Partial<Config> = {};
  try {
    const res = await explorer.search();
    cfg = res?.config;
  } catch (e) {}

  const res = { ...defaultCfg, ...cfg };

  if (res.database && res.database !== ":memory:")
    mkdirSync(dirname(res.database!), { recursive: true });

  return res;
}
