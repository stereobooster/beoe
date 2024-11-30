---
title: Diagram All The Things
---

## Strategies

### inline svg

- **pros**
  - interactivity
    - links (`a href`)
    - <Kbd>Cmd</kbd> + <Kbd>F</kbd>
    - with JS, for example, if we inline JSON data
    - need to be careful with SVGO to not remove IDs etc.
  - dark theme
    - class based
    - `prefers-color-scheme`
    - allows to add dark theme to tools that don't support it out of box (`graphviz`, `vizdom`, `gnuplot`)
- **cons**
  - CSS conflicts
    - CSS from website can affect diagram
      - potential solution `.not-content`
    - CSS from diagram can affect website (d2 diagrams)
      - this can break dark theme or other diagrams on the smae page
      - potential solution use unique prefix to make sure there is no clash
  - Dark theme can be limited (black and white)
  - DOM footprint
  - easy to integrate, especially if there is no inline CSS in SVG

### img with data-uri

- **pros**
  - no CSS conflicts
  - dark theme
    - class based. Two images with two classes and only one shown at a time depending on the theme
    - `prefers-color-scheme`: `picture` + `source media="(prefers-color-scheme: dark)` + `img`
  - no DOM footprint
- **cons**
  - no interactivity
  - no DOM footprint, but overall weight of HTML is high as in previous strategy
  - easy to integrate - only need to add a bit of CSS to support dark theme

### img external

- **pros**
  - no CSS conflicts
  - dark theme
    - class based. Two images with two classes and only one shown at a time depending on the theme
    - `prefers-color-scheme`: `picture` + `source media="(prefers-color-scheme: dark)` + `img`
  - no DOM footprint
  - lighter weight of HTML compared to previous strategy
- **cons**
  - no interactivity
  - some tools don't support dark theme out of the box (`graphviz`, `vizdom`, `gnuplot`)
  - harder to integrate - need to resolve where to write file, how to do cache busting...
