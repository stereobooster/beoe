import { h } from "hastscript";
import svgToMiniDataURI from "mini-svg-data-uri";
import parse from "@beoe/fenceparser";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { BasePluginOptions, jsonifiable, Result, Tag } from "./types.js";
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

type ImgOptions = {
  svg?: string;
  url?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
  class?: string;
};

function image({ svg, url, ...rest }: ImgOptions) {
  return h("img", {
    src: url ?? svgToMiniDataURI(svg!),
    // ...(width && height ? { style: `aspect-ratio: ${width} / ${height}` } : {}),
    ...(url ? { loading: "lazy", decoding: "async" } : {}),
    ...rest,
  });
}

function iframe({ svg, url, alt, width, height, ...rest }: ImgOptions) {
  return h("iframe", {
    src: url ?? svgToMiniDataURI(svg!),
    ...(url ? { loading: "lazy" } : {}),
    title: alt,
    ...(width && height ? { style: `aspect-ratio: ${width} / ${height}` } : {}),
    role: "img",
    frameborder: "0",
    // allowfullscreen: true,
    ...rest,
  });
}

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed
function embed({ svg, url, alt, ...rest }: ImgOptions) {
  return h("embed", {
    src: url ?? svgToMiniDataURI(svg!),
    ...(url ? { loading: "lazy" } : {}),
    title: alt,
    role: "img",
    ...rest,
  });
}

// https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/General_embedding_technologies
function imgLike(tag: Tag | undefined, opts: ImgOptions) {
  switch (tag) {
    case "iframe":
      return iframe(opts);
    case "embed":
      return embed(opts);
    default:
      return image(opts);
  }
}

function figure(
  className: string | undefined,
  children: any[],
  data: jsonifiable
) {
  return h(
    "figure",
    {
      class: className,
      "data-beoe": data ? JSON.stringify(data) : undefined,
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
    tag,
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
    figure(className, [imgLike(tag, { svg, width, height, alt })], data);

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

  if (tag !== undefined && tag !== "iframe") data = undefined;

  switch (strategy) {
    case "data-url": {
      if (darkScheme === "class" && darkSvg)
        return figure(
          className,
          // wrap in additional div for svg-pan-zoom
          [
            h("div", [
              imgLike(tag, { svg, width, height, alt, class: "beoe-light" }),
              imgLike(tag, {
                svg: darkSvg,
                width,
                height,
                alt,
                class: "beoe-dark",
              }),
            ]),
          ],
          data
        );

      if (darkScheme === "media" && darkSvg)
        if (tag === "img" || tag == undefined) {
          const imgLight = image({ svg, width, height, alt });
          const imgDark = h("source", {
            width,
            height,
            src: svgToMiniDataURI(darkSvg),
            media: `(prefers-color-scheme: dark)`,
          });

          return figure(className, [h("picture", [imgLight, imgDark])], data);
        } else {
          console.warn(
            "darkScheme media doesn't work with tag iframe or embed"
          );
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
                  imgLike(tag, {
                    width,
                    height,
                    alt,
                    class: "beoe-light",
                    url,
                  }),
                  imgLike(tag, {
                    width,
                    height,
                    alt,
                    class: "beoe-dark",
                    url: darkUrl,
                  }),
                ]),
              ],
              data
            )
        );
      }

      if (darkScheme === "media" && darkSvg)
        if (tag === "img" || tag == undefined) {
          return Promise.all([fileUrl(svg), fileUrl(darkSvg)]).then(
            ([url, darkUrl]) => {
              const imgLight = image({ width, height, alt, url });
              const imgDark = h("source", {
                width,
                height,
                src: darkUrl,
                media: `(prefers-color-scheme: dark)`,
              });

              return figure(
                className,
                [h("picture", [imgLight, imgDark])],
                data
              );
            }
          );
        } else {
          console.warn(
            "darkScheme media doesn't work with tag iframe or embed"
          );
        }

      return fileUrl(svg).then((url) =>
        figure(className, [imgLike(tag, { width, height, alt, url })], data)
      );
    }
    default: {
      if (tag != undefined) {
        console.warn("tag doesn't work with inline");
      }

      if (darkScheme === "class" && darkSvg) {
        const element = fromHtmlIsomorphic(removeWidthHeight(svg), {
          fragment: true,
        });
        const darkElement = fromHtmlIsomorphic(removeWidthHeight(darkSvg), {
          fragment: true,
        });
        return figure(
          className,
          [
            h("div", [
              h("div", { class: "beoe-light" }, element.children),
              h("div", { class: "beoe-dark" }, darkElement.children),
            ]),
          ],
          data
        );
      }

      if (darkScheme === "media") {
        console.warn("darkScheme media doesn't work for inline strategy");
      }

      const element = fromHtmlIsomorphic(removeWidthHeight(svg), {
        fragment: true,
      });
      return figure(className, element.children, data);
    }
  }
}
