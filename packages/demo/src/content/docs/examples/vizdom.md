---
title: vizdom
---

## Simple

**Interactivity**: shadow out. Try 👇 hover nodes.

```vizdom dataGraph=dagre class=shadow
digraph TD {
    cluster=true
    node [shape=box]
    subgraph Watcher {
        label="watch"
        Watch [label="FS Notifier"]
    }
    Watch -> TailW [label="*.rs & input.css"]
    Watch -> Sass [label="*.sass & *.scss"]
    Watch -> Append [label="*.css"]
    Watch -> WASM [label="*.rs"]
    Watch -> BIN [label="*.rs"]
    Watch -> Mirror [label="assets/**"]
    subgraph style {
        label=style
        TailW [label="Tailwind CSS"]
        Sass
        CSSProc [label="CSS Processor\nLightning CSS"]
        Append [label="append"]
    }
    TailW -> Append
    Sass -> Append
    Append -> CSSProc
    subgraph rust {
        label=rust
        WASM [label="Client WASM"]
        BIN [label="Server BIN"]
    }
    subgraph asset {
        label=asset
        Mirror
    }
    subgraph update {
        label=update
        WOC [label="target/site/\nWrite-on-change FS"]
        Live [label="Live Reload"]
        Server
    }
    Mirror -> WOC [label="site/**"]
    WASM -> WOC [label="site/pkg/app.wasm"]
    BIN -> WOC [label="server/app"]
    CSSProc -> WOC [label="site/pkg/app.css"]
    Live -> Server [label="Port scan", style=dashed]
    WOC -> Server [label="target/server/app\nsite/**"]
    WOC -> Live [label="site/pkg/app.css,\nclient & server change"]
    Live -> Browser [label="Reload all or\nupdate app.css"]
    Browser;
    Server -> Browser [style=dashed, arrowhead=none]
}
```

## Same example as Graphviz

**Interactivity**: ants. Try 👇 hover or click nodes.

```vizdom dataGraph=dagre class=ants
digraph finite_state_machine {
    bgcolor="transparent";
    fontname="Helvetica,Arial,sans-serif";
    node [fontname="Helvetica,Arial,sans-serif"]
    edge [fontname="Helvetica,Arial,sans-serif"]
    rankdir=LR;
    node [shape = doublecircle]; 0 3 4 8;
    node [shape = circle];
    0 -> 2 [label = "SS(B)"];
    0 -> 1 [label = "SS(S)"];
    1 -> 3 [label = "S($end)"];
    2 -> 6 [label = "SS(b)"];
    2 -> 5 [label = "SS(a)"];
    2 -> 4 [label = "S(A)"];
    5 -> 7 [label = "S(b)"];
    5 -> 5 [label = "S(a)"];
    6 -> 6 [label = "S(b)"];
    6 -> 5 [label = "S(a)"];
    7 -> 8 [label = "S(b)"];
    7 -> 5 [label = "S(a)"];
    8 -> 6 [label = "S(b)"];
    8 -> 5 [label = "S(a)"];
}
```
