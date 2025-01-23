#!/usr/bin/env node

import "global-jsdom/register";
import { compile, optimize, toSVG, showError } from "@penrose/core";
import { readFileSync } from "node:fs";

const pathResolver = (_path) => Promise.resolve(undefined);

// TODO https://github.com/penrose/penrose/blob/main/packages/roger/index.ts
// const resolvePath = (prefix, stylePaths) => {
//   const stylePrefixes = stylePaths.map((sty) => join(prefix, sty, ".."));
//   if (new Set(stylePrefixes).size > 1) {
//     console.warn(
//       chalk.yellow(
//         "Warning: the styles in this trio are not co-located. The first style will be used for image resolution."
//       )
//     );
//   }
//   const stylePrefix = stylePrefixes[0];
//   return async (filePath) => {
//     // Handle absolute URLs
//     if (/^(http|https):\/\/[^ "]+$/.test(filePath)) {
//       const fileURL = new URL(filePath).href;
//       try {
//         const fileReq = await fetch(fileURL);
//         return fileReq.text();
//       } catch (e) {
//         console.error(`Failed to resolve path: ${e}`);
//         return undefined;
//       }
//     }

//     // Relative paths
//     const joined = resolve(stylePrefix, filePath);
//     return fs.readFileSync(joined, "utf8");
//   };
// };

const trio = JSON.parse(readFileSync(0, "utf-8"));

const compiled = await compile(trio);
if (compiled.isErr()) {
  console.error(showError(compiled.error));
  process.exit(1);
}
const optimized = optimize(compiled.value);
if (optimized.isErr()) {
  console.error(showError(optimized.error));
  process.exit(1);
}
const svg = (await toSVG(optimized.value, pathResolver, "rehype")).outerHTML;
// https://github.com/stereobooster/venn-nodejs/blob/main/bin/venn-nodejs.js
// do we need different serializer
// import serialize from "w3c-xmlserializer";
// const s = new XMLSerializer();
// s.serializeToString(svg);
process.stdout.write(svg);
process.exit(0);
