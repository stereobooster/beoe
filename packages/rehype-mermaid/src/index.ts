import type { Plugin } from "unified";
import type { Root } from "hast";
import { rehypeCodeHook, type MapLike } from "@beoe/rehype-code-hook";
import {
  createMermaidRenderer,
  type CreateMermaidRendererOptions,
  type RenderOptions,
  type RenderResult,
} from "mermaid-isomorphic";
import svgToMiniDataURI from "mini-svg-data-uri";
import { h } from "hastscript";
// SVGO is an experiment. I'm not sure it can compress a lot, plus it can break some diagrams
import { optimize, type Config as SvgoConfig } from "svgo";

const svgoConfig: SvgoConfig = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // we need viewbox for inline SVGs
          removeViewBox: false,
          // this breaks statediagram
          convertShapeToPath: false,
        },
      },
    },
  ],
};

export type RehypeMermaidConfig = RenderOptions &
  CreateMermaidRendererOptions & {
    cache?: MapLike;
    class?: string;
    /**
     * be carefull. It may break some diagrams. For example, stateDiagram-v2
     */
    svgo?: SvgoConfig | boolean;
    strategy?:
      | "inline"
      | "picture-dark-mode"
      | "img-class-dark-mode"
      | "inline-class-dark-mode";
  };

function pictureDarkMode(
  light: RenderResult,
  dark: RenderResult,
  klas?: string
) {
  const imgLight = h("img", {
    width: light.width,
    height: light.height,
    alt: light.description || light.title || "",
    src: svgToMiniDataURI(light.svg),
  });

  const imgDark = h("source", {
    width: dark.width,
    height: dark.height,
    src: svgToMiniDataURI(dark.svg),
    media: `(prefers-color-scheme: dark)`,
  });

  return h(
    "figure",
    {
      class: `beoe mermaid ${klas || ""}`,
    },
    h("picture", [imgLight, imgDark])
  );
}

function imgClassDarkMode(
  light: RenderResult,
  dark: RenderResult,
  klas?: string
) {
  const imgLight = h("img", {
    width: light.width,
    height: light.height,
    alt: light.description || light.title || "",
    src: svgToMiniDataURI(light.svg),
    class: "beoe-light",
  });

  const imgDark = h("img", {
    width: dark.width,
    height: dark.height,
    alt: dark.description || dark.title || "",
    src: svgToMiniDataURI(dark.svg),
    class: "beoe-dark",
  });

  return h(
    "figure",
    {
      class: `beoe mermaid ${klas || ""}`,
    },
    // wrapp in additional div for svg-pan-zoom
    [h("div", [imgLight, imgDark])]
  );
}

export const rehypeMermaid: Plugin<[RehypeMermaidConfig?], Root> = (
  options = {}
) => {
  const {
    css,
    mermaidConfig,
    prefix,
    browser,
    launchOptions,
    svgo,
    strategy,
    ...rest
  } = options;
  const renerOptions = { css, mermaidConfig: mermaidConfig || {}, prefix };
  const createOptions = { browser, launchOptions };
  const renderDiagrams = createMermaidRenderer(createOptions);
  const salt = {
    ...renerOptions,
    ...createOptions,
    class: rest.class,
    svgo,
    strategy,
  };

  async function render(code: string, dark?: boolean) {
    const config = structuredClone(renerOptions);
    // otherwise all diagrams would have same ID and styles would collide
    config.prefix = `m${Math.random().toString().replace(".", "")}`;

    if (dark) config.mermaidConfig.theme = "dark";

    const [x] = await renderDiagrams([code], config);

    if (x.status === "fulfilled") {
      if (svgo !== false)
        x.value.svg = optimize(
          x.value.svg,
          svgo === true || svgo === undefined ? svgoConfig : svgo
        ).data;

      return x.value;
    } else {
      throw new Error(x.reason);
    }
  }

  // @ts-expect-error
  return rehypeCodeHook({
    ...rest,
    salt,
    language: "mermaid",
    code: async ({ code }) => {
      switch (strategy) {
        case "img-class-dark-mode": {
          const [light, dark] = await Promise.all([
            render(code),
            render(code, true),
          ]);
          return imgClassDarkMode(light, dark, options.class);
        }
        case "picture-dark-mode": {
          const [light, dark] = await Promise.all([
            render(code),
            render(code, true),
          ]);
          return pictureDarkMode(light, dark, options.class);
        }
        case "inline-class-dark-mode": {
          const [light, dark] = await Promise.all([
            render(code),
            render(code, true),
          ]);
          return `<figure class="beoe mermaid ${rest.class || ""}"><div>
          <div class="beoe-light">${light.svg}</div>
          <div class="beoe-dark">${dark.svg}</div>
          </div></figure>`;
        }
        default: {
          const light = await render(code);
          return `<figure class="beoe mermaid ${rest.class || ""}">${
            light.svg
          }</figure>`;
        }
      }
    },
  });
};

export default rehypeMermaid;
