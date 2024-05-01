# BEOE

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="logo/logo-dark.svg">
    <img alt="" src="logo/logo.svg" width="288" height="348">
  </picture>
</p>

**Core idea**: if you have function that can produce diagram as SVG it should be trivial to use it in Astro (or other SSG that uses remark/rehype) to create diagrams - either as rehype (remark) plugin or as Astro component.

Rehype (remark) plugins are tedious to write. If your render function is costly (headless berowser) you probably need to take care of caching. I felt like this process was over-complicated.

See [how much diagrams asciidoctor supports](https://docs.asciidoctor.org/diagram-extension/latest/).

## Status

There are still some pending TODOs. It can be rough on edges.

## Packages

### Core

- [x] [@beoe/rehype-code-hook](/packages/rehype-code-hook/)
- [x] [@beoe/sqlitecache](/packages/sqlitecache/)
- [x] [@beoe/cache](/packages/cache/)
- [x] [@beoe/remark-code-hook](/packages/remark-code-hook/)

### Diagrams

|          | rehype                                              | Astro                                             | remark |
| -------- | --------------------------------------------------- | ------------------------------------------------- | ------ |
| Graphviz | [@beoe/rehype-graphviz](/packages/rehype-graphviz/) | [@beoe/astro-graphviz](/packages/astro-graphviz/) |        |
| Mermaid  | [@beoe/rehype-mermaid](/packages/rehype-mermaid/)   | @beoe/astro-mermaid                               |        |
| Gnuplot  | [@beoe/rehype-gnuplot](/packages/rehype-gnuplot/)   | @beoe/astro-gnuplot                               |        |
| penrose  |                                                     |                                                   |        |
| ...      |                                                     |                                                   |        |

Ideas for other diagrams: https://stereobooster.com/posts/text-to-diagram/.

Out of scope:

- https://plantuml.com/, requires Java
- https://d2lang.com/, requires installation of binary. Can be supported if it would be distributed as [WASM](https://github.com/terrastruct/d2/issues/136)

### Experiments

- [x] [@beoe/rehype-pintora](/packages/rehype-mermaid/)
- [x] [@beoe/rehype-starry-night](/packages/rehype-starry-night/)
- [x] [@beoe/rehype-color-chips](/packages/rehype-color-chips/)
- [x] [demo](/packages/demo/)
- [ ] example of gnuplot custom diagram
  - any diagram which expects `input.dat`, for example https://gnuplot.sourceforge.net/demo_svg_5.4/histograms.html
  - maybe do it like [asciidoctor does for penrose](https://docs.asciidoctor.org/diagram-extension/latest/diagram_types/penrose/)?
- [ ] example of graphviz custom diagram
  - https://astro-digital-garden.stereobooster.com/recipes/timeline-diagram/
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
- [ ] venn.js
  - https://github.com/stereobooster/venn-isomorphic
- [ ] svgbob
  - https://github.com/agoose77/svgbob-wasm
- [ ] pikchr
  - https://github.com/fabiospampinato/pikchr-wasm

## TODO

- [ ] [@beoe/cache](/packages/cache/), maybe put it in `node_modules` by default?
- [ ] @beoe/astro-mermaid
- [ ] @beoe/astro-gnuplot
- [ ] write tip about `not-content` from [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)
- [ ] publish to npm and make repo public
- [ ] mention https://github.com/stereobooster/svg-pan-zoom-gesture in documentation
  - maybe move it to this monorepo?
- [ ] Do astro components need to render something in case of an error?

## Logo

Logo is illustration from [Oliver Byrne's Elements of Euclid: The First Six Books with Coloured Diagrams and Symbols](https://www.c82.net/euclid/).
