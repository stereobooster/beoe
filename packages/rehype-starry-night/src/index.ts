import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@datt/rehype-code-hook";
import { common, createStarryNight } from "@wooorm/starry-night";
import { h } from "hastscript";

const starryNight = await createStarryNight(common);

export type RehypeStarryNightConfig = {
  cache?: MapLike;
};

export const rehypeStarryNight: Plugin<[RehypeStarryNightConfig?], Root> = (
  options = {}
) => {
  // @ts-expect-error
  return rehypeCodeHook({
    ...options,
    code: ({ language, code, inline }) => {
      if (inline === true || language === undefined) return undefined;
      const scope = starryNight.flagToScope(language);
      if (scope === undefined) return undefined;

      return h("pre", [
        h("code", { class: `starry-night language-${language}` }, [
          starryNight.highlight(code, scope),
        ]),
      ]);
    },
  });
};

export default rehypeStarryNight;
