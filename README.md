# BEOE

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="logo/logo-dark.svg">
    <img alt="" src="logo/logo.svg" width="288" height="348">
  </picture>
</p>

It should be easy to add diagrams to your Markdown documentation. There are many solutions that can render diagrams inside Markdown; for example, see [Asciidoctor](https://docs.asciidoctor.org/diagram-extension/latest/).

However, if you want to add a custom diagram, it can be tedious to implement. **Core idea**: If you have a function that can produce a diagram as SVG, it should be trivial to use it in Astro (or other SSGs that use remark/rehype).

It should be easy to create documentation with many diagrams, like in [**B**yrne's **E**lements **o**f **E**uclid](https://www.c82.net/euclid/).

## Status

I have implemented core packages and added some examples. However, I still need to add more tests, configure CI, create a demo site, and address the remaining TODOs.

## Packages

### Core

- [x] [@beoe/rehype-code-hook](/packages/rehype-code-hook/)
- [x] [@beoe/sqlitecache](/packages/sqlitecache/)
- [x] [@beoe/cache](/packages/cache/)
- [x] [@beoe/remark-code-hook](/packages/remark-code-hook/)
- [x] [@beoe/pan-zoom](/packages/pan-zoom/)

### Diagrams

|          | rehype                                              |
| -------- | --------------------------------------------------- |
| Graphviz | [@beoe/rehype-graphviz](/packages/rehype-graphviz/) |
| Mermaid  | [@beoe/rehype-mermaid](/packages/rehype-mermaid/)   |
| Gnuplot  | [@beoe/rehype-gnuplot](/packages/rehype-gnuplot/)   |
| Vizdom   | [@beoe/rehype-vizdom](/packages/rehype-vizdom/)     |
| D2       | [@beoe/rehype-d2](/packages/rehype-d2/)             |
| Penrose  |                                                     |
| ...      |                                                     |

Ideas for other diagrams: [Text to Diagram](https://stereobooster.com/posts/text-to-diagram/).

## Logo

The logo is an illustration from [Oliver Byrne's Elements of Euclid: The First Six Books with Coloured Diagrams and Symbols](https://www.c82.net/euclid/).

## TODO

- [ ] try to implement external file strategy (with vfile)
- [ ] reuse [svgStrategy](packages/rehype-d2/src/svgStrategy.ts) in all plugins
- [ ] add `processMeta` to all plugins, so it would be possible to configure `class` and `strategy`
- [ ] maybe rename strategies
