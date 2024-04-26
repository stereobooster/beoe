import { expect, it } from "vitest";

import { graphvizSvg } from "../src";

it("renders SVG", async () => {
  const result = graphvizSvg(`digraph x {Start -> Stop}`);

  expect(result).toMatchFileSnapshot("./fixtures/a.out.svg");
});

it("removes width and height", async () => {
  const result = graphvizSvg(`digraph x {Start -> Stop}`);

  expect(result).not.toContain(`width=`);
  expect(result).not.toContain(`height=`);
});

it("wraps in a div with classes", async () => {
  const result = graphvizSvg(`digraph x {Start -> Stop}`);

  expect(result).toContain(`<div class="datt graphviz">`);
});

it.skip("supports fonts", async () => {
  const result = graphvizSvg(
    `digraph x {fontname="Helvetica,Arial,sans-serif"; Start -> Stop}`
  );

  expect(result).toContain(`font-family="Helvetica,Arial,sans-serif"`);
});
