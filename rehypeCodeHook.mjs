// import { visitParents } from "unist-util-visit-parents";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { toText } from "hast-util-to-text";
import { CONTINUE, SKIP, visit } from "unist-util-visit";

function isUnistNode(node) {
  return Boolean(typeof node === "object" && node !== null && node.type);
}

function isThenable(node) {
  return Boolean(typeof node === "object" && node.then);
}

function replace(newNode, index, parent) {
  if (newNode == undefined) {
    // no new node - do nothing
  } else if (isThenable(newNode)) {
    return newNode.then((newNewNode) => {
      replace(newNewNode, index, parent);
    });
  } else if (typeof newNode === "string") {
    parent.children[index] = fromHtmlIsomorphic(newNode);
  } else if (isUnistNode(newNode)) {
    // else assume mdast | hast
    parent.children[index] = newNode;
  } else {
    throw new Error("Unsupported replacement");
  }
}

export const rehypeCodeHook = (options) => {
  return (ast, file) => {
    const promises = [];

    visit(ast, "element", function (node, index, parent) {
      if (options.code) {
        let codeNode;
        let inline;
        if (
          node.tagName === "pre" &&
          node.children.length === 1 &&
          node.children[0].tagName === "code"
        ) {
          codeNode = node.children[0];
          inline = false;
        } else if (node.tagName === "code" && parent.tagName !== "pre") {
          codeNode = node;
          inline = true;
        }

        if (!codeNode) return CONTINUE;

        const language = codeNode.properties.className?.[0]?.replace(
          "language-",
          ""
        );

        console.log(codeNode);
        const newNode = options.code({
          code: toText(codeNode, { whitespace: "pre" }),
          inline,
          language,
          metastring: codeNode.properties.metastring,
        });

        const result = replace(newNode, index, parent);

        if (result && result.then) promises.push(result);

        return SKIP;
      }
    });

    // const message = file.message(reason, {
    //   ruleId: "",
    //   source: "",
    //   ancestors,
    // });
    // message.fatal = true;
    // message.url = "";
    // throw message;

    if (promises.length > 0) return Promise.all(promises).then(() => {});
  };
};
