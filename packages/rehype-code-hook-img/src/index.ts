import { rehypeCodeHook } from "@beoe/rehype-code-hook";
import { metaWithDefaults, svgStrategy } from "./utils.js";
import { BasePluginOptions, BaseOptions, Cb, CbInput } from "./types.js";
import type { Plugin } from "unified";
import type { Root } from "hast";

export type { BaseOptions, BasePluginOptions };

export type RehypeCodeHookImgOptions<T extends CbInput> = {
  render: Cb<T>;
  /**
   * if given hook will be called only for this language
   */
  language: string;
} & Omit<BasePluginOptions, "cache">;

export const rehypeCodeHookImg = <T extends CbInput>(
  options: RehypeCodeHookImgOptions<T>
) => {
  const {
    render,
    language,
    class: pluginDefaultClass,
    ...pluginDefaults
  } = options;

  const hook: Plugin<[(T & BasePluginOptions)?], Root> = (
    { cache, ...defaults } = {} as T
  ) => {
    defaults = { ...pluginDefaults, ...defaults };
    // @ts-expect-error
    return rehypeCodeHook({
      salt: defaults,
      language,
      code: ({ code, meta }) => {
        const opts = metaWithDefaults(
          pluginDefaultClass || language,
          defaults as any as T & BasePluginOptions,
          meta
        );

        if (opts.strategy === "img") {
          opts.strategy = "data-url";
          console.warn("img strategy is deprecated, use data-url instead");
        }
        if (opts.strategy === "img-class-dark-mode") {
          opts.strategy = "data-url";
          opts.darkScheme = "class";
          console.warn(
            "img-class-dark-mode strategy is deprecated, use data-url instead + darkScheme class"
          );
        }
        if (opts.strategy === "picture-dark-mode") {
          opts.strategy = "data-url";
          opts.darkScheme = "media";
          console.warn(
            "img-class-dark-mode strategy is deprecated, use data-url instead + darkScheme media"
          );
        }

        const darkMode = opts.darkScheme != undefined;
        const result = render(code, { ...opts, darkMode });
        return "then" in result
          ? result.then((x) => svgStrategy(opts, x))
          : svgStrategy(opts, result);
      },
    });
  };

  return hook;
};

export default rehypeCodeHookImg;
