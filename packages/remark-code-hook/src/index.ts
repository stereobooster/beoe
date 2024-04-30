import type { Plugin } from "unified";
import type { Root, Node } from "mdast";
// import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { CONTINUE, SKIP, visit } from "unist-util-visit";
// Other options: askorama/seqproto, pouya-eghbali/sia, deterministic-object-hash
// I haven't benchmarked it
import { serialize } from "node:v8";

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
  parent: Root | Node | undefined
) {
  if (newNode === undefined || index === undefined || parent === undefined) {
    // no new node - do nothing
  } else if (isThenable(newNode)) {
    return newNode.then((newNewNode) => {
      replace(newNewNode, index, parent);
    });
  } else if (typeof newNode === "string") {
    // const hChildren = fromHtmlIsomorphic(newNode, { fragment: true }).children;
    const element = {
      type: "html",
      value: newNode,
      // data: { hChildren },
    };
    // @ts-expect-error
    parent.children[index] = element;
  } else if (isNode(newNode)) {
    // @ts-expect-error
    parent.children[index] = newNode;
  } else {
    throw new Error("Unsupported replacement");
  }
}

export type RemerkCodeHookProps = {
  code: string;
  inline: boolean;
  language?: string;
  meta?: string;
};

export type MapLike<K = any, V = any> = {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
};

/**
 * special value to identify that saved value was undefined
 */
const EMPTY_CACHE = null;

export type RemerkCodeHookOptions = {
  code: (x: RemerkCodeHookProps) => NewNode;
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

export const remerkCodeHook: Plugin<[RemerkCodeHookOptions], Root> = (
  options
) => {
  const cb = options.code.toString();

  return (ast, file) => {
    const promises: PromiseLike<unknown>[] = [];

    visit(ast, function (codeNode, index, parent) {
      if (codeNode.type !== "code" && codeNode.type !== "inlineCode")
        return CONTINUE;

      let inline = codeNode.type === "inlineCode";
      if (options.inline !== undefined && options.inline !== inline)
        return CONTINUE;

      // @ts-expect-error
      const language = codeNode.lang;
      if (options.language !== undefined && options.language !== language)
        return CONTINUE;

      try {
        const props = {
          code: codeNode.value,
          inline,
          language,
          // @ts-expect-error
          meta: codeNode.meta,
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
            result.catch((e) =>
              file.fail(e, codeNode.position, "remerkCodeHook")
            )
          );
      } catch (e: unknown) {
        // @ts-expect-error
        file.fail(e, codeNode.position, "remerkCodeHook");
      }

      return SKIP;
    });

    if (promises.length > 0) return Promise.all(promises).then(() => {});
  };
};

export default remerkCodeHook;
