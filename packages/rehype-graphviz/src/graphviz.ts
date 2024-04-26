import { Graphviz } from "@hpcc-js/wasm";
import { minify } from "html-minifier";

const graphviz = await Graphviz.load();

const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
};

/**
 * TODO:
 * - option to load files/images
 * - other options?
 */
export const graphvizSvg = (code: string) => {
  let svg = graphviz.dot(code).split("\n").slice(6).join("\n");
  svg = minify(svg, minifyOptions);
  svg = svg.replace(/width="\d+[^"]+"\s+/, "");
  svg = svg.replace(/height="\d+[^"]+"\s+/, "");
  return `<div class="datt graphviz">${svg}</div>`;
};
