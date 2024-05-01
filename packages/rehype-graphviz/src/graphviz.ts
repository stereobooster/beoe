import { minify } from "html-minifier";

const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
};

/**
 * removes `<?xml version="1.0" encoding="UTF-8" standalone="no"?>`
 * removes `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"`
 * removes `width="..." height="..."` from svg tag
 * minifies SVG with `html-minifier`
 * wraps in a figure with class `datt graphviz`
 *
 * TODO: probably better to wrap in figure (can use title for figcaption)
 * Can also try SVGO
 */
export const processGraphvizSvg = (svg: string) => {
  svg = svg.split("\n").slice(6).join("\n");
  svg = minify(svg, minifyOptions);
  svg = svg.replace(/width="\d+[^"]+"\s+/, "");
  svg = svg.replace(/height="\d+[^"]+"\s+/, "");
  return `<figure class="datt graphviz">${svg}</figure>`;
};
