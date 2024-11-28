---
title: Diagram All The Things
---

```vizdom
digraph TD {
  cluster=true
  node [shape=box]

  rehypePlugin -> defaults

  codeFence -> code
  codeFence -> meta
  
  merge -> svgo
  merge -> class
  merge -> graphStrategy
  merge -> strategy

  subgraph configParts {
    label=configParts
    meta -> parseMeta -> merge
    defaults -> merge
  }

  svgo[label="svgo config"]

  strategy -> render

  graphStrategy -> render
  code -> render -> hw
  
  subgraph renderParts {
    render
    render -> svg
    render -> g

    svg[label="light, dark"]
    g[label="graph"]

    svg -> optimize
    svgo -> optimize
  }

  hw[label="height, width"]
  
  subgraph mdastParts {
    toMdast
  }

  optimize -> toMdast
  class -> toMdast
  hw -> toMdast
  g -> toMdast
  strategy -> toMdast
}
```
