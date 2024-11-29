import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import { metaWithDefaults, svgStrategy } from "./utils.js";
import { Cb, CbInput } from "./types.js";
import type { Plugin } from "unified";
import type { Root } from "hast";

export type RehypeCodeHookImgOptions<T extends CbInput> = {
  render: Cb<T>;
  /**
   * if given hook will be called only for this language
   */
  language: string;
};

export const rehypeCodeHookImg = <T extends CbInput>(
  options: RehypeCodeHookImgOptions<T>
) => {
  const { render, language } = options;

  const hook: Plugin<[(T & { cache?: MapLike })?], Root> = (
    { cache, ...defaults } = {} as T
  ) => {
    // @ts-expect-error
    return rehypeCodeHook({
      salt: defaults,
      language,
      code: ({ code, meta }) => {
        const opts = metaWithDefaults(language, defaults as any as T, meta);
        const result = render(code, opts);
        return "then" in result
          ? result.then((x) => svgStrategy(opts, x))
          : svgStrategy(opts, result);
      },
    });
  };

  return hook;
};

export default rehypeCodeHookImg;
