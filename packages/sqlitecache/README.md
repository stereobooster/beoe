# @datt/sqlitecache

## Motivational example

Let's say you have static site generator and it generates [Open Graph](https://ogp.me/) images. But this is costly operation and images do not change often, so you want to cache them between runs.

The simplest solution is to cache them on the file system, for example, like this: [ImageCache](https://github.com/delucis/astro-og-canvas/blob/733a77b4a0688b0ad2a44862258307f6452b26de/packages/astro-og-canvas/src/generateOpenGraphImage.ts#L50-L71) + `shorthash` + `deterministicString` (from `deterministic-object-hash`). But this approach lacks following features:

- **auto-cleanup**: if you did some experimentation and generated images that will never be used, they will never be cleaned up, unless you delete whole cache. One of the ways to solve it is, for example, **LRU** (Least Recently Used)
- **expiration**: what if instead of generating images locally I want to download them from remote destination and I want to re-download fresh version from time to time. One of the ways to solve it is, for example, **TTL** (Time To Live) aka expiration date for items
- **efficiency**: file-system is not the most effective solution for the cache

## Why SQLite?

I'm looking for something more efficiencient than file system. And this is exactly what SQLite is for:

> Think of SQLite not as a replacement for Oracle but as a replacement for `fopen()`
>
> -- [About SQLite](https://www.sqlite.org/about.html)

But why not something else? I didn't find anything better that fits following criteria:

- **embeded**. This disqualifies: Redis, Memcache and similar
- **synchronous**. This disqualifies: RocksDB, LevelDB (at least their node bindings are asynchronous) and similar
- **persistent**. This disqualifies: lru-native2, flru and similar

So here we are... I didn't do any benchmarks though

## About the code

This is **slightly** modified version of [bun-sqlite-cache](https://github.com/notskamr/bun-sqlite-cache), which is modified version of [cache-sqlite-lru-ttl](https://github.com/jkelin/cache-sqlite-lru-ttl). So most of the code written by the authors of original packages. Thank you.

## Other ideas

Here are some ideas to experiment with (but need proper benchmark first):

- is it better to use raw key or hash them to shorter (and maybe integer) version
  - `@node-rs/xxhash`, `cyrb53`
- serialization by default done with [`v8.serialize`](https://nodejs.org/api/v8.html#v8serializevalue). How it compares to others:
  - [seqproto](https://github.com/askorama/seqproto), [sia](https://github.com/pouya-eghbali/sia), CBOR, msgpack
  - no need to change default, because it can be configured with `serialize`/`deserialize` options
- there is an option to enable compression. By default it will use `node:zlib`, because it doesn't require additional dependendenies. On the other side there are more interesting ways to do it:
  - Instead of compressing each value separately we can compress whole database:
    - https://github.com/phiresky/sqlite-zstd
    - https://github.com/mlin/sqlite_zstd_vfs
    - [How to load extensions in better-sqlite3](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#loadextensionpath-entrypoint---this)
  - There are more modern compression algorithms, for example:
    - LZ4: https://github.com/antoniomuso/lz4-napi or https://github.com/PSeitz/lz4-wasm
    - Zstandard: https://github.com/OneIdentity/zstd-js or https://github.com/bokuweb/zstd-wasm
  - no need to change default, because it can be configured with `zip`/`unzip` options
- Maybe support Bun and Deno, like in [great.db](https://www.npmjs.com/package/great.db)
- Maybe support caching promises
  - untill promise resolved, cache would return the same promise from `flru`
  - as soon as promise resolved value would go to the main cache
  - if process would terminate before promise resolved it want be stored in the main (persistent) cache

## TODO

- cache suppose to reset when those changed: `zip`, `unzip`, `serialize`, `deserialize`
  - or store them as part of the key, so one can use several versions at the same time
- maybe store `created_at` for items
- maybe drop `withMeta`?
- maybe rename `zip`/`unzip` to `compress`/[`decompress`](https://english.stackexchange.com/questions/56480/difference-between-uncompress-and-decompress)?
- write "usage" section of documentation
