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
- [x] rehype-starry-night
- [x] rehype-color-chips
- [ ] cache collisions, not caching `undefined` and re-calling hook every time
  - instead introduce namespaces and cache `undefined`
- [ ] configure cache with cosmiconfig
- [ ] rehype-code-hook strategy: `replace`, `replace-child`, `append-child`, `preppend-child`, `append`, `preppend`
- [ ] load resources (wasm) only when needed (`waitFor`)
- [ ] change `gnuplotSvg`, `graphvizSvg` to wrapper-functions
  - can `html-minifier` remove doctype and `<?xml>`
- [ ] example of gnuplot custom diagram
- [ ] Do astro components need to render something in case of error?
  - maybe not - it can just show default Astro error message
- [ ] remark-code-hook
- [ ] rehype-tree-sitter
  - https://github.com/haze/rehype-tree-sitter
  - https://tree-sitter.github.io/tree-sitter/syntax-highlighting
  - https://andrewtbiehl.com/blog/jekyll-tree-sitter
  - https://github.com/devongovett/tree-sitter-highlight
  - https://crates.io/crates/tree-sitter-loader
  - https://tree-sitter.github.io/tree-sitter/creating-parsers#command-build
  - https://zed.dev/blog/language-extensions-part-1#challenges-with-packaging-parsers
  - https://www.npmjs.com/package/web-tree-sitter
  - npm package with dev dependencies on other packages providing WASM prebuilt binaries
    - on build pack all wasm binaries
    - auto release with github
    - https://github.com/wooorm/starry-night/blob/main/script/common.js
- [ ] rehype-pikchr
  - https://github.com/fabiospampinato/pikchr-wasm
- [ ] https://zenuml.com/
- [ ] https://astro-digital-garden.stereobooster.com/recipes/euler-diagram/
- ...

## Other

- Do I need to use https://github.com/svg/svgo?
- https://github.com/Microflash/fenceparser
- https://github.com/frencojobs/fenceparser

## Not gonna work

- https://github.com/plantuml/plantuml.js - I think it works only in browser
