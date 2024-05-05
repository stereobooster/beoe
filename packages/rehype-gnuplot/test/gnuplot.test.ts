import { expect, it } from "vitest";

import { processGnuplotSvg } from "../src/gnuplot";

const svg = `<?xml version="1.0" encoding="utf-8"  standalone="no"?>
<svg
 width="1000" height="500"
 viewBox="0 0 1000 500"
 xmlns="http://www.w3.org/2000/svg"
 xmlns:xlink="http://www.w3.org/1999/xlink"
>

<title>Gnuplot</title>
<desc>Produced by GNUPLOT 5.4 patchlevel 0 </desc>

<g id="gnuplot_canvas">

<rect x="0" y="0" width="1000" height="500" fill="#ffffff"/>
</g>
</svg>`;

it("removes xml doctype", async () => {
  const result = processGnuplotSvg(svg);

  expect(result).toMatchInlineSnapshot(`"<figure class="beoe gnuplot "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500"><desc>Produced by GNUPLOT 5.4 patchlevel 0</desc><path fill="#fff" d="M0 0h1000v500H0z"/></svg></figure>"`);
});

it("removes width and height", async () => {
  const result = processGnuplotSvg(svg);

  expect(result).not.toContain(`svg width=`);
  expect(result).not.toContain(`svg height=`);
});

it("wraps in a figure with classes", async () => {
  const result = processGnuplotSvg(svg);

  expect(result).toContain(`<figure class="beoe gnuplot`);
});
