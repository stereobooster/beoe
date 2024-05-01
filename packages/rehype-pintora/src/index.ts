import type { Plugin } from "unified";
import type { Root } from "hast";
import { pintoraSvg } from "./pintora.js";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";

export { pintoraSvg };

export type RehypePintoraConfig = {
  cache?: MapLike;
  class?: string;
};

export const rehypePintora: Plugin<[RehypePintoraConfig?], Root> = (
  options = {}
) => {
  const salt = { class: options.class };
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    salt,
    language: "pintora",
    code: ({ code }) => pintoraSvg(code, options.class),
  });
};

export default rehypePintora;
