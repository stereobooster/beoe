import { describe, it, expect } from "vitest";
import { SQLiteCache } from "../src";

describe("SQLiteCache", () => {
  it("Setting a cache value: value equal", () => {
    const cache = new SQLiteCache();
    const testObj = { a: 1, b: 2 };
    cache.set("test", testObj);
    const value = cache.get("test");
    cache.close();
    expect(value).toEqual(testObj);
  });

  it("No matching cache value: no value found", () => {
    const cache = new SQLiteCache();
    cache.set("other_field", { a: 1, b: 2 });
    const value = cache.get("test");
    cache.close();
    expect(value).toBeUndefined();
  });

  it("Deleting a cache value: no value found", () => {
    const cache = new SQLiteCache();
    cache.set("test", { a: 1, b: 2 });
    cache.delete("test");
    const value = cache.get("test");
    cache.close();
    expect(value).toBeUndefined();
  });

  it("Clearing the cache: no value found", () => {
    const cache = new SQLiteCache();
    cache.set("test", { a: 1, b: 2 });
    cache.clear();
    const value = cache.get("test");
    cache.close();
    expect(value).toBeUndefined();
  });

  it("Closing the cache - get value test: throw error", () => {
    const cache = new SQLiteCache();
    cache.set("test", { a: 1, b: 2 });
    cache.close();
    expect(() => {
      cache.get("test");
    }).toThrow("Cache is closed");
  });

  it("Closing the cache - set and check isClosed: be closed", () => {
    const cache = new SQLiteCache();
    cache.set("test", { a: 1, b: 2 });
    cache.close();
    const isClosed = cache.isClosed;
    expect(isClosed).toBe(true);
  });

  it("Value equal after compression", () => {
    const cache = new SQLiteCache({ useCompression: true });
    const testObj: any = {};
    for (let i = 0; i < 10000; i++) {
      testObj[i] = Math.random();
    }
    cache.set("test", testObj);
    const value = cache.get("test", true);
    cache.close();
    expect(value?.value).toEqual(testObj);
    expect(value?.compressed).toEqual(true);
  });

  it("Throw error on invalid config", () => {
    expect(() => {
      new SQLiteCache({ database: 4 as any });
    }).toThrow("Invalid 'database' configuration");
    expect(() => {
      new SQLiteCache({ defaultTtlMs: "4" as any });
    }).toThrow("Invalid 'defaultTtlMs' configuration");
    expect(() => {
      new SQLiteCache({ useCompression: "false" as any });
    }).toThrow("Invalid 'compress' configuration");
    expect(() => {
      new SQLiteCache({ maxItems: "7" as any });
    }).toThrow("Invalid 'maxItems' configuration");
  });

  // Additional tests
  it("Setting and retrieving multiple cache values", () => {
    const cache = new SQLiteCache();
    const testObj1 = { a: 1, b: 2 };
    const testObj2 = { x: "abc", y: [1, 2, 3] };
    cache.set("key1", testObj1);
    cache.set("key2", testObj2);
    const value1 = cache.get("key1");
    const value2 = cache.get("key2");
    cache.close();
    expect(value1).toEqual(testObj1);
    expect(value2).toEqual(testObj2);
  });

  it("Setting cache value with compression and checking compression status", () => {
    const cache = new SQLiteCache({ useCompression: true });
    const testObj = { a: 1, b: 2 };
    cache.set("test", testObj);
    const valueWithMeta = cache.get("test", true);
    cache.close();
    expect(valueWithMeta?.compressed).toEqual(false);
  });

  it("Deleting cache values and checking if deleted", () => {
    const cache = new SQLiteCache();
    const testObj = { a: 1, b: 2 };
    cache.set("test", testObj);
    cache.delete("test");
    const value = cache.get("test");
    cache.close();
    expect(value).toBeUndefined();
  });

  it("Clearing the cache and checking if cleared", () => {
    const cache = new SQLiteCache();
    const testObj = { a: 1, b: 2 };
    cache.set("test", testObj);
    cache.clear();
    const value = cache.get("test");
    cache.close();
    expect(value).toBeUndefined();
  });

  it("Throw error on accessing closed cache", () => {
    const cache = new SQLiteCache();
    cache.close();
    expect(() => {
      cache.get("test");
    }).toThrow("Cache is closed");
  });

  it("Check if cache is closed after closing", () => {
    const cache = new SQLiteCache();
    cache.close();
    const isClosed = cache.isClosed;
    expect(isClosed).toBe(true);
  });

  it("Throw error on invalid configuration parameters", () => {
    expect(() => {
      new SQLiteCache({ database: 4 as any });
    }).toThrow("Invalid 'database' configuration");
    expect(() => {
      new SQLiteCache({ defaultTtlMs: "4" as any });
    }).toThrow("Invalid 'defaultTtlMs' configuration");
    expect(() => {
      new SQLiteCache({ useCompression: "false" as any });
    }).toThrow("Invalid 'compress' configuration");
    expect(() => {
      new SQLiteCache({ maxItems: "7" as any });
    }).toThrow("Invalid 'maxItems' configuration");
  });

  it("Setting cache value with custom TTL and checking expiration", async () => {
    const cache = new SQLiteCache();
    const testObj = { a: 1, b: 2 };
    cache.set("test", testObj, { ttlMs: 1000 });
    const beforeValue = cache.get("test");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const afterValue = cache.get("test");
    cache.close();
    expect(beforeValue).toEqual(testObj);
    expect(afterValue).toBeUndefined();
  });
});
