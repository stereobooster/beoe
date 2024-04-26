import type { Plugin } from "unified";
import type { Root, Node, Element } from "hast";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { toText } from "hast-util-to-text";
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
  parent: Root | Element | undefined
) {
  if (newNode == undefined || index == undefined || parent == undefined) {
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
  has(key: K): boolean;
  get(key: K): V | undefined;
  set(key: K, value: V): void;
};

export type RehypeCodeHookOptions = {
  code: (x: RehypeCodeHookProps) => NewNode;
  cache?: MapLike;
  salt?: any;
  /**
   * By default hashed to Buffer. If you want to use Map as cache set this to true
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

      // @ts-expect-error
      const language = codeNode.properties.className?.[0]?.replace(
        "language-",
        ""
      );

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
          if (!options.cache.has(propsWithSalt)) {
            newNode = options.code(props);
            options.cache.set(propsWithSalt, newNode);
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
