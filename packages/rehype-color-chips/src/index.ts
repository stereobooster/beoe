import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";
import { h } from "hastscript";
import vc from "validate-color";

export type RehypeColorChipsConfig = {
  cache?: MapLike;
};

export const rehypeColorChips: Plugin<[RehypeColorChipsConfig?], Root> = (
  options = {}
) => {
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    inline: true,
    code: ({ language, code }) => {
      if (
        language !== undefined ||
        !(
          vc.validateHTMLColor(code) ||
          vc.validateHTMLColorSpecialName(code) ||
          vc.validateHTMLColorName(code)
        )
      )
        return undefined;

      return h("code", [
        code,
        h("span", {
          className: [`gfm-color-chip`],
          style: `background-color:${code};`,
        }),
      ]);
    },
  });
};

export default rehypeColorChips;
