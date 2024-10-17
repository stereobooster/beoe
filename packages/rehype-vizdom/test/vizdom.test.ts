import { expect, it } from "vitest";

import { processVizdomSvg } from "../src/vizdom";

const svg = `<svg viewBox="0.00 0.00 79.41 116.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 112)">
<title>G</title>
<polygon fill="white" stroke="none" points="-4,4 -4,-112 75.41,-112 75.41,4 -4,4"/>
<!-- Hello -->
</g>
</svg>`;

it("wraps in a figure with classes", async () => {
  const result = processVizdomSvg(svg);

  expect(result).toContain(`<figure class="beoe vizdom`);
});

it("is possible to add class", async () => {
  const result = processVizdomSvg(svg, "not-content");

  expect(result).toContain(`<figure class="beoe vizdom not-content`);
});
