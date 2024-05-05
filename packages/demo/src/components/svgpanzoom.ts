import "./SvgPanZoomUi.css";
import { SvgPanZoomUi } from "svg-pan-zoom-gesture";

// @ts-expect-error
const theme = document.querySelector("html")!.attributes["data-theme"]?.value;

const themeSelector = document.querySelector(
  "starlight-theme-select select"
) as HTMLSelectElement;

document.querySelectorAll(".beoe").forEach((container) => {
  const svg = container.querySelector("svg");
  const img = container.querySelector(`img.beoe-${theme.toString()}`);
  if (!svg && !img) return;

  // @ts-expect-error
  let instance = new SvgPanZoomUi({ element: svg || img, container });
  instance.on();

  // workaround for selector based dark mode - when there are 2 images. I don't like it
  // maybe allow to pass array to element?
  // TODO: `off()` needs to reset zoom level
  if (img && themeSelector) {
    themeSelector.addEventListener("change", () => {
      instance.off();
      const theme =
        // @ts-expect-error
        document.querySelector("html")!.attributes["data-theme"]?.value;
      const img = container.querySelector(`img.beoe-${theme.toString()}`);
      // @ts-expect-error
      instance = new SvgPanZoomUi({ element: img, container });
      instance.on();
    });
  }
});
