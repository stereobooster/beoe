import { MultiGraph } from "graphology";
import { bfsFromNode } from "graphology-traversal";

// highlight nodes and edges in graphviz on hover
document.querySelectorAll(".vizdom").forEach((container) => {
  const data = container.getAttribute("data-graph")
    ? JSON.parse(container.getAttribute("data-graph")!)
    : null;

  if (data) {
    const graph = new MultiGraph();
    graph.import(data);

    let current: string | null = null;
    container.addEventListener("mouseover", (e) => {
      // @ts-expect-error
      const node = e.target?.closest(".node");
      if (node) {
        const id = node.getAttribute("id");
        if (current == id) return;
        container
          .querySelectorAll(".node")
          .forEach((node) => node.classList.remove("active"));
        container
          .querySelectorAll(".edge")
          .forEach((node) => node.classList.remove("active"));
        bfsFromNode(graph, id, (node, _attr, _depth) => {
          container.querySelector(`#${node}`)?.classList.add("active");
          graph.outEdges(node).forEach((edge) => {
            container.querySelector(`#${edge}`)?.classList.add("active");
          });
        });
        current = id;
      } else {
        if (current == null) return;
        container
          .querySelectorAll(".node")
          .forEach((node) => node.classList.remove("active"));
        container
          .querySelectorAll(".edge")
          .forEach((node) => node.classList.remove("active"));
        current = null;
      }
    });
  }
});
