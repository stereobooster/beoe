# SQLiteCache

**Important**: this is fork of https://github.com/notskamr/bun-sqlite-cache. Need to make it clear that most of code writen by the different author (not me)

## TODO

- cache suppose to reset when those changed:
  - `zip`
  - `unzip`
  - `serialize`
  - `deserialize`
- maybe drop `withMeta`?
- TODO: test new options
- TODO: benchmark
  - `@node-rs/xxhash` or `cyrb53` (for key)
    - Do I even need hash function if there is SQLite index
  - serialize
    - https://nodejs.org/api/v8.html#v8serializevalue
    - CBOR, msgpack, seqproto, etc
  - compression
    - https://github.com/phiresky/sqlite-zstd would be more interesting
      - https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#loadextensionpath-entrypoint---this
      - https://github.com/mlin/sqlite_zstd_vfs
    - Other compressions
      - https://github.com/antoniomuso/lz4-napi
        - https://github.com/PSeitz/lz4-wasm
        - https://github.com/PSeitz/lz4_flex
      - https://github.com/OneIdentity/zstd-js
      - https://github.com/bokuweb/zstd-wasm
- if input is object use
  - `import { deterministicString } from 'deterministic-object-hash';`
    - this can be outside of cache, just accept string
- Support bun and Deno: https://www.npmjs.com/package/great.db
