import { json, alg } from "@dagrejs/graphlib";

const css = `.shadow { opacity: 0.4; }
.shape { cursor: default; }`;

// interactivity for d2 diagrams
document.querySelectorAll(".d2.shadow").forEach(async (container: Element) => {
  const data = container.getAttribute("data-beoe")
    ? JSON.parse(container.getAttribute("data-beoe")!)
    : null;

  const iframe = container.querySelector("iframe");
  if (iframe) {
    if (!iframe.contentDocument)
      await new Promise((resolve) =>
        iframe.addEventListener("load", () => resolve(0))
      );
    container = iframe.contentDocument!.querySelector("svg")! as Element;
    const styleSheet = iframe.contentDocument!.styleSheets[0];
    css
      .split("\n")
      .forEach((row) => styleSheet.insertRule(row, styleSheet.cssRules.length));
  }

  if (!data) return;
  const graph = json.read(data);

  function clear() {
    container
      .querySelectorAll("g[id]")
      .forEach((node) => node.classList.remove("shadow"));
  }

  function highlight(id: string) {
    container
      .querySelectorAll("g[id]")
      .forEach((node) => node.classList.add("shadow"));
    alg.postorder(graph, [id]).forEach((node) => {
      container
        .querySelector(`#${CSS.escape(node)}`)
        ?.classList.remove("shadow");
      graph.outEdges(node)?.forEach(({ name }) => {
        container
          .querySelector(`#${CSS.escape(name!)}`)
          ?.classList.remove("shadow");
      });
    });
  }

  // highlight on hover
  let currentHover: string | null = null;
  container.addEventListener("mouseover", (e) => {
    // @ts-expect-error
    const node = e.target?.closest(".shape");

    if (node) {
      const id = node.parentElement.getAttribute("id");
      if (currentHover == id) return;
      clear();
      highlight(id);
      currentHover = id;
    } else {
      if (currentHover == null) return;
      clear();
      currentHover = null;
    }
  });
});
