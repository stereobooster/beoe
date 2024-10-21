import { json, alg, type Path } from "@dagrejs/graphlib";

type D = { [node: string]: Path };

// interactivity for vizdom diagrams
document.querySelectorAll(".vizdom").forEach((container) => {
  const data = container.getAttribute("data-graph")
    ? JSON.parse(container.getAttribute("data-graph")!)
    : null;

  if (!data) return;
  const graph = json.read(data);

  function clear() {
    container.querySelectorAll(".node").forEach((node) => {
      node.classList.remove("active");
      node.classList.remove("selected");
    });
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

  function walkPath(d: D, node: string) {
    container.querySelector(`#node-${node}`)?.classList.add("active");
    if (d[node].distance === 0 || d[node].distance === Infinity) return;
    graph.outEdges(d[node].predecessor, node)?.forEach(({ name }) => {
      container.querySelector(`#edge-${name}`)?.classList.add("active");
    });
    walkPath(d, d[node].predecessor);
  }

  function drawShortestpath(a: string, b: string) {
    const first = alg.dijkstra(graph, a);
    if (first[b].distance != Infinity) {
      walkPath(first, b);
      return;
    }
    const second = alg.dijkstra(graph, b);
    if (second[a].distance != Infinity) {
      walkPath(second, a);
      return;
    }
  }

  let selected = new Set<string>();
  // highlight selected
  // if two nodes selected will show shortest path
  container.addEventListener("click", (e) => {
    // @ts-expect-error
    const node = e.target?.closest(".node");
    if (!node) return;
    const id = node.getAttribute("id").replace("node-", "");
    clear();

    if (selected.has(id)) {
      selected.delete(id);
    } else {
      if (selected.size < 2) {
        selected.add(id);
      } else {
        selected.delete([...selected][0]);
        selected.add(id);
      }
    }
    if (selected.size === 0) return;
    if (selected.size === 1) {
      const id = [...selected][0];
      container.querySelector(`#node-${id}`)?.classList.add("selected");
      highlight(id);
      return;
    }

    const [a, b] = [...selected];
    container.querySelector(`#node-${a}`)?.classList.add("selected");
    container.querySelector(`#node-${b}`)?.classList.add("selected");
    drawShortestpath(a, b);
  });

  // highlight on hover
  let currentHover: string | null = null;
  container.addEventListener("mouseover", (e) => {
    if (selected.size > 1) return;
    // @ts-expect-error
    const node = e.target?.closest(".node");
    if (selected.size === 0) {
      if (node) {
        const id = node.getAttribute("id").replace("node-", "");
        if (currentHover == id) return;
        clear();
        highlight(id);
        currentHover = id;
      } else {
        if (currentHover == null) return;
        clear();
        currentHover = null;
      }
    } else {
      const selectedId = [...selected][0];
      if (node) {
        const id = node.getAttribute("id").replace("node-", "");
        if (currentHover == id) return;
        clear();
        container
          .querySelector(`#node-${selectedId}`)
          ?.classList.add("selected");
        drawShortestpath(selectedId, id);
        currentHover = id;
      } else {
        if (currentHover == null) return;
        clear();
        container
          .querySelector(`#node-${selectedId}`)
          ?.classList.add("selected");
        highlight(selectedId);
        currentHover = null;
      }
    }
  });
});

// interactivity for graphviz diagrams
document.querySelectorAll(".graphviz").forEach((container) => {
  const data = container.getAttribute("data-graph")
    ? JSON.parse(container.getAttribute("data-graph")!)
    : null;

  if (!data) return;
  const graph = json.read(data);

  function clear() {
    container.querySelectorAll(".node").forEach((node) => {
      node.classList.remove("active");
      node.classList.remove("selected");
    });
    container
      .querySelectorAll(".edge")
      .forEach((node) => node.classList.remove("active"));
  }

  function highlight(id: string) {
    alg.postorder(graph, [id]).forEach((node) => {
      container.querySelector(`#node${node}`)?.classList.add("active");
      graph.outEdges(node)?.forEach(({ name }) => {
        container.querySelector(`#edge${name}`)?.classList.add("active");
      });
    });
  }

  function walkPath(d: D, node: string) {
    container.querySelector(`#node${node}`)?.classList.add("active");
    if (d[node].distance === 0 || d[node].distance === Infinity) return;
    graph.outEdges(d[node].predecessor, node)?.forEach(({ name }) => {
      container.querySelector(`#edge${name}`)?.classList.add("active");
    });
    walkPath(d, d[node].predecessor);
  }

  function drawShortestpath(a: string, b: string) {
    const first = alg.dijkstra(graph, a);
    if (first[b].distance != Infinity) {
      walkPath(first, b);
      return;
    }
    const second = alg.dijkstra(graph, b);
    if (second[a].distance != Infinity) {
      walkPath(second, a);
      return;
    }
  }

  let selected = new Set<string>();
  // highlight selected
  // if two nodes selected will show shortest path
  container.addEventListener("click", (e) => {
    // @ts-expect-error
    const node = e.target?.closest(".node");
    if (!node) return;
    const id = node.getAttribute("id").replace("node", "");
    console.log(id);
    clear();

    if (selected.has(id)) {
      selected.delete(id);
    } else {
      if (selected.size < 2) {
        selected.add(id);
      } else {
        selected.delete([...selected][0]);
        selected.add(id);
      }
    }
    if (selected.size === 0) return;
    if (selected.size === 1) {
      const id = [...selected][0];
      container.querySelector(`#node${id}`)?.classList.add("selected");
      highlight(id);
      return;
    }

    const [a, b] = [...selected];
    container.querySelector(`#node${a}`)?.classList.add("selected");
    container.querySelector(`#node${b}`)?.classList.add("selected");
    drawShortestpath(a, b);
  });

  // highlight on hover
  let currentHover: string | null = null;
  container.addEventListener("mouseover", (e) => {
    if (selected.size > 1) return;
    // @ts-expect-error
    const node = e.target?.closest(".node");
    if (selected.size === 0) {
      if (node) {
        const id = node.getAttribute("id").replace("node", "");
        if (currentHover == id) return;
        clear();
        highlight(id);
        currentHover = id;
      } else {
        if (currentHover == null) return;
        clear();
        currentHover = null;
      }
    } else {
      const selectedId = [...selected][0];
      if (node) {
        const id = node.getAttribute("id").replace("node", "");
        if (currentHover == id) return;
        clear();
        container
          .querySelector(`#node${selectedId}`)
          ?.classList.add("selected");
        drawShortestpath(selectedId, id);
        currentHover = id;
      } else {
        if (currentHover == null) return;
        clear();
        container
          .querySelector(`#node${selectedId}`)
          ?.classList.add("selected");
        highlight(selectedId);
        currentHover = null;
      }
    }
  });
});