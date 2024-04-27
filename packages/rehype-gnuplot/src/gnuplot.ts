// @ts-ignore
import gnuplot from "gnuplot-wasm";
import { minify } from "html-minifier";

const { render } = await gnuplot({
  // locateFile: () => wasmPath,
});

const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
};

export const gnuplotSvg = (code: string) => {
  let { svg } = render(code)
  svg = svg.split("\n").slice(1).join("\n");
  svg = minify(svg, minifyOptions);
  svg = svg.replace(/\s+width="\d+[^"]*"/, "");
  svg = svg.replace(/\s+height="\d+[^"]*"/, "");
  return `<div class="datt gnuplot">${svg}</div>`;
};
