# Diagram All The Things (datt)

**Core idea**: if you have function that can produce diagram as SVG it should be trivial to use it in astro to create diagrams - either as rehype (remark) plugin or as Astro component.

Rehype (remark) plugins are tedious to write. If your render function is long (headless berowser) you probably need to take care of caching. I felt like this process was complicated.

## Packages

### Core

- [x] [@datt/rehype-code-hook](/packages/rehype-code-hook/)
- [x] [@datt/sqlitecache](/packages/sqlitecache/)
- [x] [@datt/cache](/packages/cache/)
- [ ] remark-code-hook
  - because of https://github.com/withastro/starlight/discussions/1259#discussioncomment-9247236

### Diagrams

|          | rehype                                              | Astro                | remark |
| -------- | --------------------------------------------------- | -------------------- | ------ |
| Graphviz | [@datt/rehype-graphviz](/packages/rehype-graphviz/) | @datt/astro-graphviz |        |
| Mermaid  | [@datt/rehype-mermaid](/packages/rehype-mermaid/)   |                      |        |
| Gnuplot  | [@datt/rehype-gnuplot](/packages/rehype-gnuplot/)   |                      |        |
| venn.js  |                                                     |                      |        |
| pikchr   |                                                     |                      |        |
|          |                                                     |                      |        |

Support as much as possible diagrams from https://stereobooster.com/posts/text-to-diagram/, basically everything that has WASM or node package.

### Experiments

- [x] [@datt/rehype-pintora](/packages/rehype-mermaid/)
- [x] @datt/rehype-starry-night
- [x] @datt/rehype-color-chips
- [x] demo
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

## TODO

- [ ] write documentation
- [ ] check if `@datt` organization available on npm
- [ ] astro-mermaid
- [ ] astro-gnuplot
- [ ] example of gnuplot custom diagram
- [ ] mention https://github.com/stereobooster/svg-pan-zoom-gesture id documentation
  - maybe move it to this monorepo?
- [ ] Do astro components need to render something in case of an error?
- [ ] rehype-code-hook strategy: `replace`, `replace-child`, `append-child`, `preppend-child`, `append`, `preppend`
  - or maybe don't try to overcomplicate it
