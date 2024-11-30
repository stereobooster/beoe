import { h } from "hastscript";
import svgToMiniDataURI from "mini-svg-data-uri";
import parse from "@beoe/fenceparser";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { BasePluginOptions, Result } from "./types.js";
import { optimize, type Config as SvgoConfig } from "svgo";

const svgoConfig: SvgoConfig = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // we need viewBox because width and height are removed
          removeViewBox: false,
          // we need ids for client-side interactivity
          cleanupIds: false,
          // this allows to style rects
          // convertShapeToPath: false,
        },
      },
    },
    // @ts-ignore
    {
      name: "removeAttrs",
      params: {
        attrs: ".*;(title|xlink:title)",
        elemSeparator: ";",
        preserveCurrentColor: false,
      },
    },
  ],
};

function processMeta(meta?: string): Record<string, any> {
  return meta ? parse(meta, { lowerCase: false }) : {};
}

export function metaWithDefaults<
  T extends Record<string, any> & BasePluginOptions
>(defClass: string, def: T, meta?: string): T {
  const metaOptions = processMeta(meta);
  return {
    ...def,
    ...metaOptions,
    class: ["beoe", defClass, def.class, metaOptions.class]
      .filter(Boolean)
      .join(" "),
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

function figure(className: string | undefined, children: any[]) {
  return h(
    "figure",
    {
      class: className,
    },
    children
  );
}

export function svgStrategy(
  { class: className, strategy, svgo }: BasePluginOptions,
  { svg, data, darkSvg, width, height, alt }: Result
) {
  if (svgo !== false) {
    // @ts-expect-error
    svgoConfig.plugins[0].params.overrides.cleanupIds = !data;
    svg = optimize(
      svg,
      svgo === undefined || svgo === true ? svgoConfig : svgo
    ).data;
    if (darkSvg) {
      darkSvg = optimize(
        darkSvg,
        svgo === undefined || svgo === true ? svgoConfig : svgo
      ).data;
    }
  }

  if (width === undefined || height === undefined) {
    const widthMatch = svg.match(/width="(\d+[^"]*)"\s+/);
    width = widthMatch ? widthMatch[1] : undefined;

    const heightMatch = svg.match(/height="(\d+[^"]*)"\s+/);
    height = heightMatch ? heightMatch[1] : undefined;
  }

  switch (strategy) {
    case "img": {
      return figure(className, [image({ svg, width, height, alt })]);
    }
    case "img-class-dark-mode": {
      if (!darkSvg)
        return figure(className, [image({ svg, width, height, alt })]);

      return figure(
        className,
        // wrap in additional div for svg-pan-zoom
        [
          h("div", [
            image({ svg, width, height, alt, class: "beoe-light" }),
            image({ svg: darkSvg, width, height, alt, class: "beoe-dark" }),
          ]),
        ]
      );
    }
    case "picture-dark-mode": {
      if (!darkSvg) return figure(className, [image({ svg, width, height, alt })]);

      const imgLight = image({ svg, width, height, alt });
      const imgDark = h("source", {
        width,
        height,
        src: svgToMiniDataURI(darkSvg),
        media: `(prefers-color-scheme: dark)`,
      });

      return figure(className, [h("picture", [imgLight, imgDark])]);
    }
    default: {
      svg = svg.replace(new RegExp(`width="${width}[^"]*"\\s+`), "");
      svg = svg.replace(new RegExp(`height="${height}[^"]*"\\s+`), "");

      const element = fromHtmlIsomorphic(svg, { fragment: true });
      return {
        type: "element",
        tagName: "figure",
        properties: {
          class: className,
          "data-beoe": data ? JSON.stringify(data) : undefined,
        },
        children: element.children,
      };
    }
  }
}
