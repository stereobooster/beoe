import { json, alg } from "@dagrejs/graphlib";

// interactivity for vizdom diagrams
document.querySelectorAll(".vizdom").forEach((container) => {
  const data = container.getAttribute("data-graph")
    ? JSON.parse(container.getAttribute("data-graph")!)
    : null;

  if (!data) return;
  const graph = json.read(data);

  function clear() {
    container
      .querySelectorAll(".node")
      .forEach((node) => node.classList.remove("active"));
    container
      .querySelectorAll(".edge")
      .forEach((node) => node.classList.remove("active"));
  }

  function highlight(id: string) {
    alg.postorder(graph, [id]).forEach((node) => {
      container.querySelector(`#node-${node}`)?.classList.add("active");
      graph.outEdges(node)?.forEach(({ name }) => {
        container.querySelector(`#edge-${name}`)?.classList.add("active");
      });
    });
  }

  let currentSelected: string | null = null;
  container.addEventListener("click", (e) => {
    // @ts-expect-error
    const node = e.target?.closest(".node");
    if (!node) return;
    const id = node.getAttribute("id").replace("node-", "");
    clear();
    if (currentSelected == id) {
      currentSelected = null;
      return;
    }
    currentSelected = id;
    highlight(id)
  });

  // highlight on hover
  let currentHover: string | null = null;
  container.addEventListener("mouseover", (e) => {
    if (currentSelected !== null) return;
    // @ts-expect-error
    const node = e.target?.closest(".node");
    if (node) {
      const id = node.getAttribute("id").replace("node-", "");
      if (currentHover == id) return;
      clear();
      highlight(id)
      currentHover = id;
    } else {
      if (currentHover == null) return;
      clear();
      currentHover = null;
    }
  });
});
