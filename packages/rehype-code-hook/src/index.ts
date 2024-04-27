import type { Plugin } from "unified";
import type { Root, Node, Element } from "hast";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { toText } from "hast-util-to-text";
import { CONTINUE, SKIP, visit } from "unist-util-visit";
// Other options: askorama/seqproto, pouya-eghbali/sia, deterministic-object-hash
// I haven't benchmarked it
import { serialize } from "node:v8";

export { waitFor } from "./waitFor.js";

function isNode(node: unknown): node is Node {
  return Boolean(typeof node === "object" && node !== null && "type" in node);
}

function isThenable(node: unknown): node is PromiseLike<unknown> {
  return Boolean(typeof node === "object" && node !== null && "then" in node);
}

type NewNode = undefined | string | Node | Promise<undefined | string | Node>;

function replace(
  newNode: NewNode,
  index: number | undefined,
  parent: Root | Element | undefined
) {
  if (newNode === undefined || index === undefined || parent === undefined) {
    // no new node - do nothing
  } else if (isThenable(newNode)) {
    return newNode.then((newNewNode) => {
      replace(newNewNode, index, parent);
    });
  } else if (typeof newNode === "string") {
    const element = fromHtmlIsomorphic(newNode, { fragment: true });
    // @ts-expect-error
    parent.children[index] = element;
  } else if (isNode(newNode)) {
    // @ts-expect-error
    parent.children[index] = newNode;
  } else {
    throw new Error("Unsupported replacement");
  }
}

export type RehypeCodeHookProps = {
  code: string;
  inline: boolean;
  language?: string;
  metastring?: string;
};

export type MapLike<K = any, V = any> = {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
};

/**
 * special value to identify that saved value was undefined
 */
const EMPTY_CACHE = null;

export type RehypeCodeHookOptions = {
  code: (x: RehypeCodeHookProps) => NewNode;
  cache?: MapLike;
  /**
   * if given hook will be called only for this language
   */
  language?: string;
  /**
   * if given hook will be called only for inline or block code
   */
  inline?: boolean;
  /**
   * Other configuration which can influence result, so cache would reset when it changes
   */
  salt?: any;
  /**
   * By default hashed to Buffer. If you want to use Map as cache - set this to true
   **/
  hashTostring?: boolean;
};

export const rehypeCodeHook: Plugin<[RehypeCodeHookOptions], Root> = (
  options
) => {
  const cb = options.code.toString();

  return (ast, file) => {
    const promises: PromiseLike<unknown>[] = [];

    visit(ast, "element", function (node, index, parent) {
      let codeNode;
      let inline = false;
      if (
        node.tagName === "pre" &&
        node.children.length === 1 &&
        // @ts-expect-error
        node.children[0].tagName === "code"
      ) {
        codeNode = node.children[0];
        inline = false;
        // @ts-expect-error
      } else if (node.tagName === "code" && parent?.tagName !== "pre") {
        codeNode = node;
        inline = true;
      }

      if (!codeNode) return CONTINUE;

      if (options.inline !== undefined && options.inline !== inline)
        return CONTINUE;

      // @ts-expect-error
      const language = codeNode.properties.className?.[0]?.replace(
        "language-",
        ""
      );

      if (options.language !== undefined && options.language !== language)
        return CONTINUE;

      try {
        const props = {
          code: toText(codeNode, { whitespace: "pre" }),
          inline,
          language,
          // @ts-expect-error
          metastring: codeNode.data?.meta || codeNode.properties.metastring,
        };

        let newNode: NewNode;
        if (options.cache) {
          let propsWithSalt: string | Buffer = serialize({
            ...props,
            cb,
            salt: options.salt,
          });
          if (options.hashTostring === true) {
            propsWithSalt = propsWithSalt.toString();
          }
          newNode = options.cache.get(propsWithSalt);
          if (newNode === EMPTY_CACHE) return CONTINUE;
          if (newNode === undefined) {
            newNode = options.code(props);
            if (isThenable(newNode)) {
              // while promise not resilved there will be cache misses
              // TODO: should I cache promises in memory until they setled?
              newNode.then((x) => {
                if (x === undefined) {
                  options.cache!.set(propsWithSalt, EMPTY_CACHE);
                } else {
                  options.cache!.set(propsWithSalt, x);
                }
                return x;
              });
            } else {
              if (newNode === undefined) {
                options.cache.set(propsWithSalt, EMPTY_CACHE);
              } else {
                options.cache.set(propsWithSalt, newNode);
              }
            }
          }
        } else {
          newNode = options.code(props);
        }

        const result = replace(newNode, index, parent);

        if (isThenable(result))
          promises.push(
            result.catch((e) => file.fail(e, node.position, "rehypeCodeHook"))
          );
      } catch (e: unknown) {
        // @ts-expect-error
        file.fail(e, node.position, "rehypeCodeHook");
      }

      return SKIP;
    });

    if (promises.length > 0) return Promise.all(promises).then(() => {});
  };
};

export default rehypeCodeHook;
