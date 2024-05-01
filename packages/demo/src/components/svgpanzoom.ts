import "./SvgPanZoomUi.css";
import { SvgPanZoomUi } from "svg-pan-zoom-gesture";

document.querySelectorAll(".datt").forEach((container) => {
  // @ts-expect-error
  new SvgPanZoomUi({ element: container.querySelector("svg"), container }).on();
});
