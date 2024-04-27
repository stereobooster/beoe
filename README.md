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
- [x] cache
- [x] rehype-pintora
- [x] rehype-mermaid
- [x] rehype-gnuplot
- [ ] change `gnuplotSvg`, `graphvizSvg` to wrapper-functions
- [ ] remove `has` from SQLiteCache
- [ ] example of gnuplot custom diagram
- [ ] rehype-color-chips
  - just because it should be easy https://github.com/shreshthmohan/rehype-color-chips
- [ ] rehype-starry-night
  - just because it should be easy https://github.com/Microflash/rehype-starry-night
- [ ] Do astro components need to render something in case of error?
  - maybe not - it can just show default Astro error message
- [ ] what about cache collisions?
- [ ] configure cache with cosmiconfig
- [ ] remark-code-hook
- [ ] rehype-tree-sitter
  - https://github.com/haze/rehype-tree-sitter
- [ ] rehype-pikchr
  - https://github.com/fabiospampinato/pikchr-wasm
- [ ] https://zenuml.com/
- [ ] https://astro-digital-garden.stereobooster.com/recipes/euler-diagram/
- ...

## Other

- https://github.com/svg/svgo
- https://github.com/Microflash/fenceparser
- https://github.com/frencojobs/fenceparser

## Not gonna work

- https://github.com/plantuml/plantuml.js - I think it works only in browser
