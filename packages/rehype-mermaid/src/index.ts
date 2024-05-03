import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import {
  createMermaidRenderer,
  type CreateMermaidRendererOptions,
  type RenderOptions,
} from "mermaid-isomorphic";

export type RehypeMermaidConfig = RenderOptions &
  CreateMermaidRendererOptions & {
    cache?: MapLike;
    class?: string;
  };

export const rehypeMermaid: Plugin<[RehypeMermaidConfig?], Root> = (
  options = {}
) => {
  const { css, mermaidConfig, prefix, browser, launchOptions, ...rest } =
    options;
  const renerOptions = { css, mermaidConfig: mermaidConfig || {}, prefix };
  const createOptions = { browser, launchOptions };
  const renderDiagrams = createMermaidRenderer(createOptions);
  const salt = { ...renerOptions, ...createOptions, class: rest.class };
  // @ts-expect-error
  return rehypeCodeHook({
    ...rest,
    salt,
    language: "mermaid",
    code: ({ code }) => {
      const c = structuredClone(renerOptions);
      // otherwise all diagrams would have same ID and styles would collide
      c.prefix = `m${Math.random().toString().replace(".", "")}`;
      return renderDiagrams([code], c).then(([x]) => {
        if (x.status === "fulfilled") {
          return `<figure class="beoe mermaid ${rest.class || ""}">${
            x.value.svg
          }</figure>`;
        } else {
          throw new Error(x.reason);
        }
      });
    },
  });
};

export default rehypeMermaid;

// Tried to combine dark/light mode CSS in one style. It doesn't work
// const dark = structuredClone(renerOptions);
// dark.mermaidConfig.theme = "dark";
//
// code: ({ code }) => {
//       return Promise.all([
//         renderDiagrams([code], renerOptions),
//         renderDiagrams([code], dark),
//       ]).then(([[x], [y]]) => {
//         if (x.status === "fulfilled" && y.status === "fulfilled") {
//           const xStyle = /<style>([^<]*)<\/style>/.exec(x.value.svg);
//           const yStyle = /<style>([^<]*)<\/style>/.exec(y.value.svg);
//           // https://caniuse.com/css-nesting
//           const joinedStyles = `<style>
//           @media (prefers-color-scheme: light){
//             :root:not([data-theme='dark']){
//               ${xStyle?.[1]}
//             }
//           }
//           @media (prefers-color-scheme: dark){
//             :root:not([data-theme='light']){
//               ${yStyle?.[1]}
//             }
//           }</style>`;
//
//           const svg = x.value.svg.replace(xStyle?.[0] || "", joinedStyles);
//
//           return `<figure class="beoe mermaid ${
//             rest.class || ""
//           }">${svg}</figure>`;
//         } else {
//           // @ts-expect-error
//           throw new Error(x.reason || y.resaon);
//         }
//       });
//     },
