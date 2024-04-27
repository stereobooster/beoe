import type { Plugin } from "unified";
import type { Root } from "hast";
import { pintoraSvg } from "./pintora.js";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";

export { pintoraSvg };

export type RehypePintoraConfig = {
  cache?: MapLike;
};

export const rehypePintora: Plugin<[RehypePintoraConfig?], Root> = (
  options = {}
) => {
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    language: "pintora",
    code: ({ code }) => pintoraSvg(code),
  });
};

export default rehypePintora;
