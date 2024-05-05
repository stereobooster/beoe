# BEOE

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="logo/logo-dark.svg">
    <img alt="" src="logo/logo.svg" width="288" height="348">
  </picture>
</p>

It should be easy to add diagrams to your markdown documentation. There are a lot of solutions which can render diagrams inside markdown, for example, see [asciidoctor](https://docs.asciidoctor.org/diagram-extension/latest/).

But if you want to add custom diagram it can be tedious to implement. **Core idea**: if you have function that can produce diagram as SVG it should be trivial to use it in Astro (or other SSG that uses remark/rehype).

It should be easy to create documentation with a lot of diagrams, like in [**B**yrne's **E**lements **o**f **E**uclid](https://www.c82.net/euclid/).

## Status

I implemented core packages and added some examples. But I still need to add more tests, configure CI, create demo site and fix all the rest of TODOs

## Packages

### Core

- [x] [@beoe/rehype-code-hook](/packages/rehype-code-hook/)
- [x] [@beoe/sqlitecache](/packages/sqlitecache/)
- [x] [@beoe/cache](/packages/cache/)
- [x] [@beoe/remark-code-hook](/packages/remark-code-hook/)

### Diagrams

|          | rehype                                              | Astro |
| -------- | --------------------------------------------------- | ----- |
| Graphviz | [@beoe/rehype-graphviz](/packages/rehype-graphviz/) |       |
| Mermaid  | [@beoe/rehype-mermaid](/packages/rehype-mermaid/)   |       |
| Gnuplot  | [@beoe/rehype-gnuplot](/packages/rehype-gnuplot/)   |       |
| penrose  |                                                     |       |
| ...      |                                                     |       |

Ideas for other diagrams: https://stereobooster.com/posts/text-to-diagram/.

### Experiments

- [x] [@beoe/rehype-pintora](/experiments/rehype-mermaid/)
- [x] [@beoe/rehype-starry-night](/experiments/rehype-starry-night/)
- [x] [@beoe/rehype-color-chips](/experiments/rehype-color-chips/)
- [x] [demo](/packages/demo/)
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

- [ ] reuse `processGraphvizSvg` in `@beoe/astro-graphviz`
- [ ] make `@beoe/cache` usable in Astro components
- [ ] example of gnuplot custom diagram
  - any diagram which expects `input.dat`, for example https://gnuplot.sourceforge.net/demo_svg_5.4/histograms.html
  - maybe do it like [asciidoctor does for penrose](https://docs.asciidoctor.org/diagram-extension/latest/diagram_types/penrose/)?
- [ ] example of graphviz custom diagram
  - https://astro-digital-garden.stereobooster.com/recipes/timeline-diagram/
- [ ] publish to npm and make repo public
- [ ] @beoe/astro-mermaid
- [ ] @beoe/astro-gnuplot
- [ ] Github CI fails (localy everything works)
- [ ] I think there is a problem with `turbo`. It has problems if there are more than 10 packages. Maybe try `Nx`?
- [ ] write tip about `not-content` from [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)
- [ ] Do astro components need to render something in case of an error?
- [ ] maybe move to this monorepo [svg-pan-zoom-gesture](https://github.com/stereobooster/svg-pan-zoom-gesture)
- [ ] maybe move to this monorepo [venn-isomorphic](https://github.com/stereobooster/venn-isomorphic)
- [ ] maybe move to this monorepo [gnuplot-wasm](https://github.com/stereobooster/gnuplot-wasm)

## Notes

- https://github.com/svg/svgo alternatives
  - https://www.npmjs.com/package/@minify-html/node
  - https://github.com/pleshevskiy/node-svgcleaner
  - https://github.com/RazrFalcon/svgcleaner

## Logo

Logo is an illustration from [Oliver Byrne's Elements of Euclid: The First Six Books with Coloured Diagrams and Symbols](https://www.c82.net/euclid/).
