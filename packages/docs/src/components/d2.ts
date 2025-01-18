import { json, alg } from "@dagrejs/graphlib";

// interactivity for d2 diagrams
document.querySelectorAll(".d2.shadow").forEach((container) => {
  const data = container.getAttribute("data-beoe")
    ? JSON.parse(container.getAttribute("data-beoe")!)
    : null;

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
