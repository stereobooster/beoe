# Notes

## Experiments

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
- [ ] venn.js (Astro component)
  - https://github.com/stereobooster/venn-isomorphic
- [ ] edeap
  - https://github.com/stereobooster/edeap
- [ ] svgbob (rehype)
  - https://github.com/agoose77/svgbob-wasm
- [ ] pikchr (rehype)
  - https://github.com/fabiospampinato/pikchr-wasm
- [ ] Crazy idea: write transpiler from Mermaid to Graphviz. At least `flowchart` should be possible to convert
  - There is [flow.jison](https://github.com/mermaid-js/mermaid/blob/3809732e48a0822fad596d0815a6dc0e166dda94/packages/mermaid/src/diagrams/flowchart/parser/flow.jison)
- [ ] regex syntax highliting
  - https://github.com/slevithan/regex-colorizer
- [ ] railroad diagrams
  - https://github.com/tabatkins/railroad-diagrams
  - https://github.com/warpdesign/brackets-regex-diagram
  - https://github.com/klorenz/atom-regex-railroad-diagrams
- [ ] ER diagram based on Graphviz
  - https://github.com/troelskn/ergen/blob/master/ergen
  - https://github.com/BurntSushi/erd

## TODO

- [ ] make `@beoe/cache` usable in Astro components
  - alternative approach pass it to the component as prop and the wrap whole component locally?
  - [ ] `@beoe/astro-mermaid`
  - [ ] `@beoe/astro-gnuplot`
- [ ] example of gnuplot custom diagram
  - any diagram which expects `input.dat`, for example https://gnuplot.sourceforge.net/demo_svg_5.4/histograms.html
  - maybe do it like [asciidoctor does for penrose](https://docs.asciidoctor.org/diagram-extension/latest/diagram_types/penrose/)?
- [ ] example of graphviz custom diagram
  - https://astro-digital-garden.stereobooster.com/recipes/timeline-diagram/
- [ ] I think there is a problem with `turbo`. It has problems if there are more than 10 packages. Maybe try `Nx`?
- [ ] write tip about `not-content` from [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)
- [ ] Do astro components need to render something in case of an error?
- [ ] maybe move to this monorepo [venn-isomorphic](https://github.com/stereobooster/venn-isomorphic)
- [ ] maybe move to this monorepo [gnuplot-wasm](https://github.com/stereobooster/gnuplot-wasm)

## svgo alternatives

- https://github.com/svg/svgo
  - https://www.npmjs.com/package/@minify-html/node
  - https://github.com/pleshevskiy/node-svgcleaner
  - https://github.com/RazrFalcon/svgcleaner

## textDimensions

Alternatives to client-side `textDimensions`:

- [resvg-js](https://github.com/yisibl/resvg-js)?
- [canvas](https://github.com/Brooooooklyn/canvas)
  - [measureText](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText)

npm packages:

- [get-text-width](https://www.npmjs.com/package/get-text-width)
- [js-server-text-width](https://github.com/Evgenus/js-server-text-width)
- [text-width](https://www.npmjs.com/package/text-width)
- [string-pixel-width](https://github.com/adambisek/string-pixel-width)
