# Diagram All The Things (datt)

## Idea

- remark-code-hook
- rehype-code-hook
- persistent LRU, TTL cache (sqlite or other)
- astro components

Support as much as possible diagrams from https://stereobooster.com/posts/text-to-diagram/, basically everything that has WASM or node package.

## TODO

- [ ] monorepo setup (pnpm, Turbo)
- [ ] rehype-code-hook
  - template for modern rehype/remark plugin with Typescript?
  - tests

## Notes

### Persistent cache

- https://github.com/jkelin/cache-sqlite-lru-ttl
- universal DB https://www.npmjs.com/package/great.db
- serialize key → hash
  - https://github.com/delucis/astro-og-canvas/blob/733a77b4a0688b0ad2a44862258307f6452b26de/packages/astro-og-canvas/src/generateOpenGraphImage.ts#L94-L111
- serialize / deserialize data
  - JSON-alike (CBOR, msgpack, seqproto, etc)
  - https://nodejs.org/api/v8.html#v8serializevalue
- compress / decompress data
  - optional https://github.com/Brooooooklyn/snappy
  - optional https://github.com/OneIdentity/zstd-js
  - https://github.com/bokuweb/zstd-wasm
- namespace?
- other
  - https://keyv.org/docs/
    - https://github.com/as3long/keyv-better-sqlite3
  - https://github.com/notskamr/bun-sqlite-cache
  - https://bestofjs.org/projects?tags=caching
  - https://bestofjs.org/projects/lru-cache
  - https://bestofjs.org/projects/micro-memoize
  - https://bestofjs.org/projects/kvjs
