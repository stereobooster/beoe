import type { Plugin } from "unified";
import type { Root, Node, Element } from "hast";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { toText } from "hast-util-to-text";
import { CONTINUE, SKIP, visit } from "unist-util-visit";

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
    const root = fromHtmlIsomorphic(newNode);
    // TODO: there can be more than one element, maybe need to inset all of them
    // @ts-expect-error
    const element = root.children[0].children[1].children[0];
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

export type RehypeCodeHookOptions = {
  code: (x: RehypeCodeHookProps) => NewNode;
};

export const rehypeCodeHook: Plugin<[RehypeCodeHookOptions], Root> = (
  options
) => {
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
        const newNode = options.code({
          code: toText(codeNode, { whitespace: "pre" }),
          inline,
          language,
          // @ts-expect-error
          metastring: codeNode.data?.meta || codeNode.properties.metastring,
        });

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
