import "./SvgPanZoomUi.css";
import { SvgPanZoomUi } from "svg-pan-zoom-gesture";

document.querySelectorAll(".datt").forEach((container) => {
  const element = container.querySelector("svg");
  // @ts-expect-error
  new SvgPanZoomUi({ element, container }).on();
});
