import { minify } from "html-minifier";

const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
};

/**
 * removes `<?xml version="1.0" encoding="utf-8"  standalone="no"?>`
 * removes `width="..." height="..."` from svg tag
 * minifies SVG with `html-minifier`
 * wraps in a div with class `datt gnuplot`
 * 
 * TODO: probably better to wrap in figure (can use title for figcaption)
 * Can also try SVGO
 */
export const processGnuplotSvg = (svg: string) => {
  svg = svg.split("\n").slice(1).join("\n");
  svg = minify(svg, minifyOptions);
  svg = svg.replace(/\s+width="\d+[^"]*"/, "");
  svg = svg.replace(/\s+height="\d+[^"]*"/, "");
  return `<div class="datt gnuplot">${svg}</div>`;
};
