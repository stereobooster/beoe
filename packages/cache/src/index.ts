import { SQLiteCache } from "@datt/sqlitecache";
import process from "node:process";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

let cache: SQLiteCache;

export const getCache = () => {
  const dbPath = join(process.cwd(), ".datt/datt.sqlite");
  mkdirSync(dirname(dbPath), { recursive: true });
  if (!cache) {
    // TODO: it should read config, for example, with cosmiconfig
    // plus escape hatch to provide your own cache implementation
    cache = new SQLiteCache({
      database: dbPath,
      maxItems: 1024,
    });

    // Not sure if this is the best way to do it...
    process.on("exit", () => cache.close());
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
