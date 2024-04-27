---
title: starry-nigth
---

## rehype-starry-nigth

```ts
import {common, createStarryNight} from 'https://esm.sh/@wooorm/starry-night@3'
```

```html
<script type="module">
  import {common, createStarryNight} from 'https://esm.sh/@wooorm/starry-night@3?bundle'
</script>
```

```html
<!-- This supports light and dark mode automatically. -->
<link rel="stylesheet" href="https://esm.sh/@wooorm/starry-night@3/style/both.css">
```

````md
```markdown
# Hello, world!
```
````

```html
<span class="pl-mh"><span class="pl-mh">#</span><span class="pl-mh"> </span>Hello, world!</span>
```

```ts
import {common, createStarryNight} from '@wooorm/starry-night'

const starryNight = await createStarryNight(common)

const scope = starryNight.flagToScope('markdown')
const tree = starryNight.highlight('# hi', scope)

console.log(tree)
```