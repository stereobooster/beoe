// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Plugin } from "unified";
// @ts-expect-error The inferred type of '...' cannot be named without a reference to
import type { Root } from "hast";
import { rehypeCodeHookImg } from "@beoe/rehype-code-hook-img";
// @ts-ignore
import plantuml from "plantuml";

export type RehypePlantumlConfig = {};

export const rehypePlantuml = rehypeCodeHookImg<RehypePlantumlConfig>({
  language: "plantuml",
  render: async (code: string) => {
    let svg: string = await plantuml(code);
    svg = svg.replace(`contentStyleType="text/css"`, "");
    svg = svg.replace(`preserveAspectRatio="none"`, "");
    svg = svg.replace(`zoomAndPan="magnify"`, "");
    svg = svg.replace(/style="[^"]+"\s+/, "");

    return { svg };
  },
});

export default rehypePlantuml;
