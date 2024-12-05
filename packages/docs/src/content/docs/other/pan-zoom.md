---
title: "@beoe/pan-zoom"
---

```gnuplot
set grid nopolar
set grid xtics nomxtics ytics nomytics noztics nomztics nortics nomrtics \
 nox2tics nomx2tics noy2tics nomy2tics nocbtics nomcbtics
set grid layerdefault   lt 0 linecolor 0 linewidth 0.500,  lt 0 linecolor 0 linewidth 0.500
set samples 21, 21
set isosamples 11, 11
set style data lines
set title "3D surface from a function"
set xlabel "X axis"
set xlabel  offset character -3, -2, 0 font "" textcolor lt -1 norotate
set xrange [ -10.0000 : 10.0000 ] noreverse nowriteback
set x2range [ * : * ] noreverse writeback
set ylabel "Y axis"
set ylabel  offset character 3, -2, 0 font "" textcolor lt -1 rotate
set yrange [ -10.0000 : 10.0000 ] noreverse nowriteback
set y2range [ * : * ] noreverse writeback
set zlabel "Z axis"
set zlabel  offset character -5, 0, 0 font "" textcolor lt -1 norotate
set zrange [ * : * ] noreverse writeback
set cbrange [ * : * ] noreverse writeback
set rrange [ * : * ] noreverse writeback
set colorbox vertical origin screen 0.9, 0.2 size screen 0.05, 0.6 front  noinvert bdefault
NO_ANIMATION = 1
## Last datafile plotted: "$grid"
splot x**2+y**2, x**2-y**2
```

Small JS library to add **pan and zoom** functionality to **SVG** (inline or image). It supports **gestures** for all types of devices:

| intention | mouse                   | trackpad/touchpad | touchscren      |
| --------- | ----------------------- | ----------------- | --------------- |
| pan       | click + move            | click + move      | two finger drag |
| zoom      | <kbd>Ctrl</kbd> + wheel | pinch             | pinch           |
| reset     | double click            | double click      | double tap      |
|           |                         |                   |                 |
| scroll    | wheel                   | two finger drag   | one finger drag |

Pay attention:

- gestures intentionally selected to not interfere with the system's default scroll gestures, **to avoid "scroll traps"**
- all actions are available through gestures, so it works without UI. You can add UI, though. Library exposes methods for this, like `pan(dx, dy)` and `zoom(scale)`
- <kbd>Cmd</kbd> + click - zoom in
- <kbd>Alt</kbd> + click - zoom out
- First double click (tap) - zoom in x2

## Usage

There are two flavors:

- Headless - without UI
- Default UI

### Headless

If you **have container** element in HTML:

```ts
import { PanZoom } from "@beoe/pan-zoom";

document.querySelectorAll(".beoe").forEach((container) => {
  const element = container.firstElementChild;
  if (!element) return;
  new PanZoom({ element, container }).on();
});
```

If you **don't have** container element in HTML:

```ts
import { PanZoom } from "@beoe/pan-zoom";

document.querySelectorAll("svg, img[src$='.svg' i]").forEach((element) => {
  if (element.parentElement?.tagName === "PICTURE") {
    element = element.parentElement;
  }
  const container = document.createElement("div");
  container.className = "beoe";
  element.replaceWith(container);
  container.append(element);
  new PanZoom({ element, container }).on();
});
```

Additionally following CSS is required:

```css
.beoe {
  overflow: hidden;
  touch-action: pan-x pan-y;
  user-select: none;
  cursor: grab;
}

.beoe svg,
.beoe img {
  /* need to center smaller images to fix bug in zoom functionality */
  margin: auto;
  display: block;
  /* need to fit bigger images */
  max-width: 100%;
  height: auto;
}

.beoe img {
  pointer-events: none;
}
```

Instance methods:

- `on()` - adds event listeners
- `off()` - removes event listeners
- `pan(dx, dy)` - pans image
- `zoom(scale)` - zooms image
- `reset()` - resets pan and zoom values

### Default UI

```ts
import "@beoe/pan-zoom/css/PanZoomUi.css";
import { PanZoomUi } from "@beoe/pan-zoom";

document.querySelectorAll(".beoe").forEach((container) => {
  const element = container.firstElementChild;
  if (!element) return;
  new PanZoomUi({ element, container }).on();
});
```

Additionally, CSS to style UI required (for example with Tailwind):

```css
.beoe .buttons {
  @apply inline-flex;
}
.beoe .zoom-in {
  @apply bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l;
}
.beoe .reset {
  @apply bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4;
}
.beoe .zoom-out {
  @apply bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r;
}
```

You can configure HTML classes used by UI:

```ts
const classes = {
  zoomIn: "zoom-in",
  reset: "reset",
  zoomOut: "zoom-out",
  buttons: "buttons",
  tsWarning: "touchscreen-warning",
  tsWarningActive: "active",
};

new PanZoomUi({ element, container, classes });
```

and message with instructions for the touchscreen:

```ts
const message = "Use two fingers to pan and zoom";

new PanZoomUi({ element, container, message });
```

## Pixelation in Safari

Be aware that some CSS will cause pixelation of SVG on zoom (bug in Safari), for example:

- `will-change: transform;`
- `transform: matrix3d(...);`
- `transition-property: transform;` (it setles after animation, though)

## TODO

- [ ] Do not stretch images if they are smaller than viewport
- [ ] Do not show PanZoom UI for small images
- [ ] Prevent clicks on drag or pan
- [ ] minimap and full-screen mode, like in [reactflow](https://reactflow.dev/examples/nodes/custom-node)
- [ ] Create a Rehype plugin to wrap images in a container (`<figure class="beoe"></figure>`) to avoid creating it on the client side.
