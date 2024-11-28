import { h } from "hastscript";
import svgToMiniDataURI from "mini-svg-data-uri";
import { lex as lexMeta, parse as parseMeta } from "fenceparser";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";

function processMeta(meta?: string): Record<string, any> {
  return meta ? parseMeta(lexMeta(meta)) : {};
}

export type LowercaseRec<T extends Record<string, any>> = {
  [K in keyof T as `${Lowercase<string & K>}`]: T[K];
};

export function metaWithDefaults<T extends Record<string, any>>(
  defClass: string,
  def: T,
  meta?: string
): { [K in keyof T as `${Lowercase<string & K>}`]: T[K] } & {
  class: string;
  darktheme?: string;
} {
  const metaOptions = processMeta(meta);
  return {
    ...Object.fromEntries(
      Object.entries(def).map(([k, v]) => [k.toLowerCase(), v])
    ),
    ...metaOptions,
    class: `${defClass} ${def.class || ""} ${metaOptions.class || ""}`.trim(),
  } as any;
}

function image({
  svg,
  ...rest
}: {
  width?: string | number;
  height?: string | number;
  alt?: string;
  svg: string;
  class?: string;
}) {
  return h("img", {
    src: svgToMiniDataURI(svg),
    ...rest,
  });
}

function figure(cssClass: string, children: any[]) {
  return h(
    "figure",
    {
      class: `beoe ${cssClass}`,
    },
    children
  );
}

/**
 * Maybe rename img to data-uri
 */
export type Strategy =
  // SVG directly in the HTML
  | "inline"
  // this doesn't make sense
  // | "inline-class-dark-mode"
  // SVG as data-uri in img
  | "img"
  // SVG as data-uri in img and source inside of a picture
  | "picture-dark-mode"
  // SVG as data-uri in two imgs with light and dark classes
  | "img-class-dark-mode";

type SvgStrategyBase = {
  strategy?: Strategy;
  cssClass: string;
};

type SvgStrategyCbResult = {
  width?: string | number;
  height?: string | number;
  lightSvg: string;
  darkSvg?: string;
  graph?: any;
};

type SvgStrategyOptions = SvgStrategyCbResult & SvgStrategyBase;

export function svgStrategy({
  strategy,
  cssClass,
  lightSvg,
  darkSvg,
  width,
  height,
  graph,
}: SvgStrategyOptions) {
  switch (strategy) {
    case "img": {
      return figure(cssClass, [image({ svg: lightSvg, width, height })]);
    }
    case "img-class-dark-mode": {
      if (!darkSvg)
        return figure(cssClass, [image({ svg: lightSvg, width, height })]);

      return figure(
        cssClass,
        // wrap in additional div for svg-pan-zoom
        [
          h("div", [
            image({ svg: lightSvg, width, height, class: "beoe-light" }),
            image({ svg: darkSvg, width, height, class: "beoe-dark" }),
          ]),
        ]
      );
    }
    case "picture-dark-mode": {
      if (!darkSvg)
        return figure(cssClass, [image({ svg: lightSvg, width, height })]);

      const imgLight = image({ svg: lightSvg, width, height });
      const imgDark = h("source", {
        width,
        height,
        src: svgToMiniDataURI(darkSvg),
        media: `(prefers-color-scheme: dark)`,
      });

      return figure(cssClass, [h("picture", [imgLight, imgDark])]);
    }
    // case "inline-class-dark-mode": {
    //   return `<figure class="beoe ${cssClass}">
    //     <div>
    //       <div class="beoe-light">${lightSvg}</div>
    //       <div class="beoe-dark">${darkSvg}</div>
    //     </div>
    //   </figure>`;
    // }
    default: {
      const element = fromHtmlIsomorphic(lightSvg, { fragment: true });
      return {
        type: "element",
        tagName: "figure",
        properties: {
          class: `beoe ${cssClass}`,
          "data-graph": graph ? JSON.stringify(graph) : undefined,
        },
        children: element.children,
      };
    }
  }
}

type SvgStrategyCb = (darkMode: boolean) => SvgStrategyCbResult;
export function svgStrategyCb(
  strategy: Strategy | undefined,
  cssClass: string,
  cb: SvgStrategyCb
) {
  return svgStrategy({
    strategy,
    cssClass,
    ...cb(
      strategy === "img-class-dark-mode" || strategy === "picture-dark-mode"
    ),
  });
}

type SvgStrategyCbAsync = (darkMode: boolean) => Promise<SvgStrategyCbResult>;
export async function svgStrategyCbAsync(
  strategy: Strategy | undefined,
  cssClass: string,
  cb: SvgStrategyCbAsync
) {
  return svgStrategy({
    strategy,
    cssClass,
    ...(await cb(
      strategy === "img-class-dark-mode" || strategy === "picture-dark-mode"
    )),
  });
}
