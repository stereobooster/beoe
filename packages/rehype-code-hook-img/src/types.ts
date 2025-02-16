import { MapLike } from "@beoe/rehype-code-hook";
import { type Config as SvgoConfig } from "svgo";

export type jsonifiable =
  | string
  | number
  | boolean
  | null
  | jsonifiable[]
  | readonly jsonifiable[]
  | { [key: string]: jsonifiable }
  | undefined;

export type Result = {
  svg: string;
  /**
   * used for img `width`
   */
  width?: string | number;
  /**
   * used for img `height`
   */
  height?: string | number;
  /**
   * used for dark mode
   */
  darkSvg?: string;
  /**
   * used for `data-beoe` to pass JSON representation of diagram for interactivity
   */
  data?: jsonifiable;
  /**
   * used for img `alt`
   */
  alt?: string;
  // maybe aria-describedby?
  // maybe figcaption?
};

export type BaseOptions = {
  darkMode?: boolean;
};

export type BasePluginOptions = {
  class?: string;
  svgo?: SvgoConfig | boolean;
  strategy?: Strategy;
  cache?: MapLike;
  darkScheme?: Scheme;
  /**
   * @default img
   */
  tag?: Tag;
  /**
   * required for `file` strategy
   */
  fsPath?: string;
  /**
   * required for `file` strategy
   */
  webPath?: string;
};

export type Scheme = "class" | "media";

export type Tag =
  | "img"
  /**
   * experimental https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/General_embedding_technologies
   */
  | "iframe"
  /**
   * experimental https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed
   */
  | "embed"
  /**
   * experimental https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object
   */
  | "object";

export type Strategy =
  /**
   * SVG directly in the HTML
   */
  | "inline"
  /**
   * SVG in `src` as [data-url](https://developer.mozilla.org/en-US/docs/Web/URI/Schemes/data)
   */
  | "data-url"
  /**
   * SVG as standalone file in `img`
   */
  | "file"
  /**
   * SVG as data-uri in img
   * @deprecated
   */
  | "img"
  /**
   * SVG as data-uri in img and source inside of a picture
   * @deprecated
   */
  | "picture-dark-mode"
  /**
   * SVG as data-uri in two imgs with light and dark classes
   * @deprecated
   */
  | "img-class-dark-mode";

export type CbResult = Result | Promise<Result>;

export type CbInput = Record<string, any>;

export type Cb<T extends CbInput> = (
  code: string,
  opt: T & BaseOptions
) => CbResult;
