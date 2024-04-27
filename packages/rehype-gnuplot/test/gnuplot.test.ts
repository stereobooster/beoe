import { expect, it } from "vitest";

import { gnuplotSvg } from "../src/gnuplot";

const code = `
set key fixed left top vertical Right noreverse enhanced autotitle box lt black linewidth 1.000 dashtype solid
set samples 50, 50
set title "Simple Plots" 
set title  font ",20" textcolor lt -1 norotate
set xrange [ * : * ] noreverse writeback
set x2range [ * : * ] noreverse writeback
set yrange [ * : * ] noreverse writeback
set y2range [ * : * ] noreverse writeback
set zrange [ * : * ] noreverse writeback
set cbrange [ * : * ] noreverse writeback
set rrange [ * : * ] noreverse writeback
set colorbox vertical origin screen 0.9, 0.2 size screen 0.05, 0.6 front  noinvert bdefault
NO_ANIMATION = 1
plot [-10:10] sin(x),atan(x),cos(atan(x))`;

it("renders SVG", async () => {
  const result = gnuplotSvg(code);

  expect(result).toMatchFileSnapshot("./fixtures/a.out.svg");
});

it("removes width and height", async () => {
  const result = gnuplotSvg(code);

  expect(result).not.toContain(`svg width=`);
  expect(result).not.toContain(`svg height=`);
});

it("wraps in a div with classes", async () => {
  const result = gnuplotSvg(code);

  expect(result).toContain(`<div class="datt gnuplot">`);
});
