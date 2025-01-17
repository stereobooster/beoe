// @ts-ignore https://github.com/terrastruct/d2/issues/2286
import { D2 } from "@terrastruct/d2";

export type D2Options = {
  layout?: "dagre" | "elk";
  sketch?: boolean;
  themeID?: number;
};

export async function d2(
  code: string,
  options?: D2Options
): Promise<string> {
  const d2Instance = new D2();
  const result = await d2Instance.compile(code, options);
  const svg = await d2Instance.render(result.diagram, options);
  return svg
}
