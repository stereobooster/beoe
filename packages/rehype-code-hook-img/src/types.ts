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
  /**
   * required for file-based strategy
   */
  fsPath?: string;
  /**
   * required for file-based strategy
   */
  webPath?: string;
};

/**
 * maybe rename img to data-uri
 */
export type Strategy =
  /**
   * SVG directly in the HTML
   */
  | "inline"
  /**
   * SVG as data-uri in img
   */
  | "img"
  /**
   * SVG as data-uri in img and source inside of a picture
   */
  | "picture-dark-mode"
  /**
   * SVG as data-uri in two imgs with light and dark classes
   */
  | "img-class-dark-mode"
  /**
   * Experiment
   */
  | "f-img"
  | "f-picture-dark-mode"
  | "f-img-class-dark-mode";

export type CbResult = Result | Promise<Result>;

export type CbInput = Record<string, any>;

export type Cb<T extends CbInput> = (
  code: string,
  opt: T & BaseOptions
) => CbResult;
