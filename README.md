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
- [x] [@beoe/pan-zoom](/packages/pan-zoom/)

### Diagrams

|          | rehype                                              | Astro |
| -------- | --------------------------------------------------- | ----- |
| Graphviz | [@beoe/rehype-graphviz](/packages/rehype-graphviz/) |       |
| Mermaid  | [@beoe/rehype-mermaid](/packages/rehype-mermaid/)   |       |
| Gnuplot  | [@beoe/rehype-gnuplot](/packages/rehype-gnuplot/)   |       |
| penrose  |                                                     |       |
| ...      |                                                     |       |

Ideas for other diagrams: https://stereobooster.com/posts/text-to-diagram/.

## Logo

Logo is an illustration from [Oliver Byrne's Elements of Euclid: The First Six Books with Coloured Diagrams and Symbols](https://www.c82.net/euclid/).
