import { SQLiteCache } from "@beoe/sqlitecache";
import process from "node:process";
import { getConfig, Config, MapLike, defineConfig } from "./config.js";
export { Config, defineConfig };

let cachePromise: Promise<MapLike>;

const getCacheOriginal = async () => {
  const { override, ...cfg } = await getConfig();
  if (override) {
    return override;
  }

  const cache = new SQLiteCache(cfg);

  if (!cfg.readonly) {
    // Not sure if this is the best way to do it...
    process.on("exit", () => (cache as SQLiteCache).close());
    // catches ctrl+c event
    process.on("SIGINT", () => process.exit());
    // catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", () => process.exit());
    process.on("SIGUSR2", () => process.exit());
    // catches uncaught exceptions
    process.on("uncaughtException", () => process.exit());
  }

  return cache;
};

export const getCache = () => {
  if (!cachePromise) {
    cachePromise = getCacheOriginal();
  }

  return cachePromise;
};
