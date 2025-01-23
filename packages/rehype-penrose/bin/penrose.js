#!/usr/bin/env node

import "global-jsdom/register";
import { compile, optimize, toSVG, showError } from "@penrose/core";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { readFileSync } from "node:fs";

// https://github.com/penrose/penrose/blob/main/packages/roger/index.ts
const resolvePath = (stylePath) => {
  const stylePrefix = join(stylePath, "..");
  return async (filePath) => {
    // Handle absolute URLs
    if (/^(http|https):\/\/[^ "]+$/.test(filePath)) {
      const fileURL = new URL(filePath).href;
      try {
        const fileReq = await fetch(fileURL);
        return fileReq.text();
      } catch (e) {
        console.error(e);
        return undefined;
      }
    }

    // Relative paths
    const joined = resolve(stylePrefix, filePath);
    return readFile(joined, "utf8");
  };
};

const opts = JSON.parse(readFileSync(0, "utf8"));
const path = opts.style;

opts.domain = await readFile(opts.domain, "utf8");
opts.style = `canvas {
  width = ${opts.width}
  height = ${opts.height}
}
${await readFile(opts.style, "utf8")}`;

const compiled = await compile(opts);
if (compiled.isErr()) {
  console.error(showError(compiled.error));
  process.exit(1);
}
const optimized = optimize(compiled.value);
if (optimized.isErr()) {
  console.error(showError(optimized.error));
  process.exit(1);
}
const svgElement = await toSVG(optimized.value, resolvePath(path), "rehype");

// https://github.com/stereobooster/venn-nodejs/blob/main/bin/venn-nodejs.js
// import serialize from "w3c-xmlserializer";
// const s = new XMLSerializer();
// const svg = s.serializeToString(svgElement);
const svg = svgElement.outerHTML;

function chunkString(str, length) {
  return str.match(new RegExp(".{1," + length + "}", "g"));
}

// writeFileSync("tmp.svg", svg, "utf8")
chunkString(svg, 1024).forEach((str) => process.stdout.write(str));
process.exit(0);
