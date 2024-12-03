import { h } from "hastscript";
import svgToMiniDataURI from "mini-svg-data-uri";
import parse from "@beoe/fenceparser";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { BasePluginOptions, Result } from "./types.js";
import { optimize, type Config as SvgoConfig } from "svgo";
import path from "node:path";
import fs from "node:fs/promises";
import { xxh32 } from "@node-rs/xxhash";

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
  url,
  ...rest
}: {
  svg?: string;
  url?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
  class?: string;
}) {
  return h("img", {
    src: url ?? svgToMiniDataURI(svg!),
    ...(url ? { loading: "lazy", decoding: "async" } : {}),
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
  {
    class: className,
    strategy,
    svgo,
    fsPath,
    webPath,
    darkScheme,
    alt: optsAlt,
  }: BasePluginOptions & { alt?: string },
  { svg, data, darkSvg, width, height, alt }: Result
) {
  alt ??= optsAlt;

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
    const widthMatch = svg.match(/width="(\d+)[^"]*"\s+/);
    width = widthMatch ? widthMatch[1] : undefined;

    const heightMatch = svg.match(/height="(\d+)[^"]*"\s+/);
    height = heightMatch ? heightMatch[1] : undefined;
  }

  const getImage = () =>
    figure(className, [image({ svg, width, height, alt })]);

  const fileUrl = async (svg: string) => {
    if (!fsPath || !webPath) return "";

    const name = `${xxh32(svg).toString(36)}.svg`;
    const filePath = path.join(fsPath, name);
    const url = path.posix.join(webPath, name);
    await fs.mkdir(fsPath, { recursive: true });
    await fs.writeFile(filePath, svg);

    return url;
  };

  const removeWidthHeight = (svg: string) =>
    svg
      .replace(new RegExp(`width="${width}[^"]*"\\s+`), "")
      .replace(new RegExp(`height="${height}[^"]*"\\s+`), "");

  if (strategy == "file" && (fsPath == undefined || webPath == undefined)) {
    console.warn(
      "file strategy requires fsPath and webPath. Falling back to data-url"
    );
    strategy = "data-url";
  }

  switch (strategy) {
    case "data-url": {
      if (darkScheme === "class" && darkSvg)
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

      if (darkScheme === "media" && darkSvg) {
        const imgLight = image({ svg, width, height, alt });
        const imgDark = h("source", {
          width,
          height,
          src: svgToMiniDataURI(darkSvg),
          media: `(prefers-color-scheme: dark)`,
        });

        return figure(className, [h("picture", [imgLight, imgDark])]);
      }

      return getImage();
    }
    case "file": {
      if (fsPath == undefined || webPath == undefined) return;

      if (darkScheme === "class" && darkSvg) {
        return Promise.all([fileUrl(svg), fileUrl(darkSvg)]).then(
          ([url, darkUrl]) =>
            figure(
              className,
              // wrap in additional div for svg-pan-zoom
              [
                h("div", [
                  image({ width, height, alt, class: "beoe-light", url }),
                  image({
                    width,
                    height,
                    alt,
                    class: "beoe-dark",
                    url: darkUrl,
                  }),
                ]),
              ]
            )
        );
      }

      if (darkScheme === "media" && darkSvg)
        return Promise.all([fileUrl(svg), fileUrl(darkSvg)]).then(
          ([url, darkUrl]) => {
            const imgLight = image({ width, height, alt, url });
            const imgDark = h("source", {
              width,
              height,
              src: darkUrl,
              media: `(prefers-color-scheme: dark)`,
            });

            return figure(className, [h("picture", [imgLight, imgDark])]);
          }
        );

      return fileUrl(svg).then((url) =>
        figure(className, [image({ width, height, alt, url })])
      );
    }
    default: {
      if (darkScheme === "class" && darkSvg) {
        const element = fromHtmlIsomorphic(removeWidthHeight(svg), {
          fragment: true,
        });
        const darkElement = fromHtmlIsomorphic(removeWidthHeight(darkSvg), {
          fragment: true,
        });
        return h(
          "figure",
          {
            class: className,
            "data-beoe": data ? JSON.stringify(data) : undefined,
          },
          [
            h("div", [
              h("div", { class: "beoe-light" }, element.children),
              h("div", { class: "beoe-dark" }, darkElement.children),
            ]),
          ]
        );
      }

      if (darkScheme === "media") {
        console.warn("darkScheme media doesn't work for inline strategy");
      }

      const element = fromHtmlIsomorphic(removeWidthHeight(svg), {
        fragment: true,
      });
      return h(
        "figure",
        {
          class: className,
          "data-beoe": data ? JSON.stringify(data) : undefined,
        },
        element.children
      );
    }
  }
}
