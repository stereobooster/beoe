---
title: d2 test
draft: true
---

## options

### sketch

```d2 sketch
direction: right
a -> b -> c -> d -> e
```

### layout

```d2 layout=elk
direction: right
a -> b -> c -> f
b -> d -> e -> f
```

### theme

```d2 theme=101
direction: right
a1 -> b -> c -> d -> e
```

### pad

```d2 pad=1
direction: right
a2 -> b -> c -> d -> e
```

### `strategy=inline`

```d2 strategy=inline
direction: right
a -> b -> c -> d -> e
```
