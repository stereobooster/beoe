# Diagram All The Things (datt)

## Idea

- remark-code-hook
- rehype-code-hook
- persistent LRU, TTL cache (sqlite or other)
- astro components

Support as much as possible diagrams from https://stereobooster.com/posts/text-to-diagram/, basically everything that has WASM or node package.

## TODO

- [x] rehype-code-hook
- [ ] cache
- [ ] remark-code-hook
- [ ] first rehype diagram integration

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
  - https://github.com/antoniomuso/lz4-napi
  - https://github.com/PSeitz/lz4-wasm
    - https://github.com/PSeitz/lz4_flex
- namespace?
- other
  - https://keyv.org/docs/
    - https://github.com/as3long/keyv-better-sqlite3
  - https://github.com/notskamr/bun-sqlite-cache
  - https://bestofjs.org/projects?tags=caching
  - https://bestofjs.org/projects/lru-cache
  - https://bestofjs.org/projects/micro-memoize
  - https://bestofjs.org/projects/kvjs

## Diagrams

- https://github.com/remcohaszing/mermaid-isomorphic
- https://github.com/hikerpig/pintora
- https://github.com/plantuml/plantuml.js
- https://www.npmjs.com/package/@hpcc-js/wasm
- etc.

## Other

- https://github.com/shreshthmohan/rehype-color-chips
- https://github.com/mapbox/rehype-highlight-code-block
- https://github.com/rehypejs/rehype-highlight (lowlight, js)
- https://shiki.matsu.io/packages/rehype (shiki, ts)
  - https://github.com/rsclarke/rehype-shiki (old)
  - https://rehype-pretty.pages.dev/
- https://github.com/haze/rehype-tree-sitter (tree-sitter, js)
- https://www.npmjs.com/package/rehype-prism (prism, ts)
  - https://www.npmjs.com/package/rehype-prism-plus
- https://github.com/Microflash/rehype-starry-night (starry-night, js)
- https://github.com/svg/svgo
