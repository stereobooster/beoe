// to make sure anchors open in top frame
document
  .querySelectorAll(".beoe iframe")
  // @ts-expect-error
  .forEach((iframe: HTMLIFrameElement) => {
    const addTargets = () =>
      iframe.contentDocument
        ?.querySelectorAll("a")
        .forEach((x) => x.setAttribute("target", "_top"));
    iframe.addEventListener("load", addTargets);
    addTargets();
  });
