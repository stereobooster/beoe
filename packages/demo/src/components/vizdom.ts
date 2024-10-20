import { json } from "@dagrejs/graphlib";

// highlight nodes and edges in vizdom on hover
document.querySelectorAll(".vizdom").forEach((container) => {
  const data = container.getAttribute("data-graph")
    ? JSON.parse(container.getAttribute("data-graph")!)
    : null;

  if (data) {
    const graph = json.read(data);
    let current: string | null = null;
    container.addEventListener("mouseover", (e) => {
      // @ts-expect-error
      const node = e.target?.closest(".node");
      if (node) {
        const id = node.getAttribute("id").replace("node-", "");
        if (current == id) return;
        container
          .querySelectorAll(".node")
          .forEach((node) => node.classList.remove("active"));
        container
          .querySelectorAll(".edge")
          .forEach((node) => node.classList.remove("active"));

        [id, ...(graph.successors(id) || [])].forEach((node) => {
          container.querySelector(`#node-${node}`)?.classList.add("active");
          graph.outEdges(node)?.forEach(({ name }) => {
            container.querySelector(`#edge-${name}`)?.classList.add("active");
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
