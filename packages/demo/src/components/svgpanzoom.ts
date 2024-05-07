import "./SvgPanZoomUi.css";
import { SvgPanZoomUi } from "svg-pan-zoom-gesture";

document.querySelectorAll(".beoe").forEach((container) => {
  const element = container.firstElementChild;
  if (!element) return;
  // @ts-expect-error
  new SvgPanZoomUi({ element, container }).on();
});
