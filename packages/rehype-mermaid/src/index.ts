import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";
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
  const renerOptions = { css, mermaidConfig, prefix };
  const createOptions = { browser, launchOptions };
  const renderDiagrams = createMermaidRenderer(createOptions);
  const salt = { ...renerOptions, ...createOptions, class: rest.class };
  // @ts-expect-error
  return rehypeCodeHook({
    ...rest,
    salt,
    language: "mermaid",
    code: ({ code }) => {
      return renderDiagrams([code], renerOptions).then(([x]) => {
        if (x.status === "fulfilled") {
          return `<figure class="datt mermaid ${rest.class || ""}">${
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
