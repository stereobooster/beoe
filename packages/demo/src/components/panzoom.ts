import "@beoe/pan-zoom/css/PanZoomUi.css";
import { PanZoomUi } from "@beoe/pan-zoom";

document.querySelectorAll(".beoe").forEach((container) => {
  const element = container.firstElementChild;
  if (!element) return;
  // @ts-expect-error
  new PanZoomUi({ element, container }).on();
});
