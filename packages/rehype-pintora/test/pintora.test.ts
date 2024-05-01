import { expect, it } from "vitest";

import { pintoraSvg } from "../src/pintora";

const diagram = `activityDiagram
title: Activity Diagram Simple Action
:Action 1;
:Action 2;`

it("renders SVG", async () => {
  const result = await pintoraSvg(diagram);

  expect(result).toMatchFileSnapshot("./fixtures/a.out.svg");
});

it.skip("removes width and height", async () => {
  const result = await pintoraSvg(diagram);

  expect(result).not.toContain(`svg width=`);
  expect(result).not.toContain(`svg height=`);
});

it("wraps in a figure with classes", async () => {
  const result = await pintoraSvg(diagram);

  expect(result).toContain(`<figure class="beoe pintora`);
});
