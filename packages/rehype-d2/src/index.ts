// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import { rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";
import { D2Options, d2 } from "./d2.js";

export type RehypeD2Config = {
  d2Options?: Omit<D2Options, "themeID"> & {
    theme?: string;
    darkTheme?: string;
  };
};

export const rehypeD2 = rehypeCodeHookImg<RehypeD2Config>({
  language: "d2",
  render: async (code: string, opts) => {
    const { darkMode, d2Options, ...rest } = opts;
    const newD2Options = { ...d2Options, ...rest };
    if (newD2Options.theme !== undefined) {
      // @ts-ignore
      newD2Options.themeID = parseFloat(newD2Options.theme);
    }
    const svg = await d2(code, newD2Options);
    const darkSvg = darkMode
      ? await d2(code, {
          ...newD2Options,
          // @ts-ignore
          themeID: parseFloat(newD2Options?.darkTheme ?? "200"),
        })
      : undefined;
    return { svg, darkSvg };
  },
});

export default rehypeD2;
