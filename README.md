# Diagram All The Things (datt)

## Idea

- remark-code-hook
- rehype-code-hook
- persistent LRU, TTL cache (sqlite or other)
- astro components

Support as much as possible diagrams from https://stereobooster.com/posts/text-to-diagram/, basically everything that has WASM or node package.

## TODO

- [x] rehype-code-hook
- [x] rehype-graphviz
- [x] astro demo
- [x] SQLiteCache
- [x] astro-graphviz
- [ ] cache
- [ ] remark-code-hook
- [ ] rehype-gnuplot
- [ ] rehype-plantuml
  - https://github.com/plantuml/plantuml.js
- [ ] rehype-pintora
  - https://github.com/hikerpig/pintora
- [ ] rehype-mermaid
  - https://github.com/remcohaszing/mermaid-isomorphic
  - it makes sense only with cache
- [ ] rehype-color-chips
  - just because it should be easy https://github.com/shreshthmohan/rehype-color-chips
- [ ] rehype-starry-night
  - just because it should be easy https://github.com/Microflash/rehype-starry-night
- [ ] rehype-tree-sitter
  - https://github.com/haze/rehype-tree-sitter
- [ ] rehype-pikchr
  - https://github.com/fabiospampinato/pikchr-wasm
- ...

---

- [ ] add classes to output (to SVG or wrapping div)
  - use classes to show how to style (dark mode maybe)
- [ ] shared cache
  - use it in demo

## Other

- https://github.com/svg/svgo
- https://github.com/kangax/html-minifier
- https://github.com/Microflash/fenceparser
- https://github.com/frencojobs/fenceparser
