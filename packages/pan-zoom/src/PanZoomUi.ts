import { PanZoom, PanZoomProps } from "./PanZoom.js";

const defaultClasses = {
  zoomIn: "zoom-in",
  reset: "reset",
  zoomOut: "zoom-out",
  buttons: "buttons",
  tsWarning: "touchscreen-warning",
  tsWarningActive: "active",
};

const defaultMessage = "Use two fingers to pan and zoom";

export type PanZoomUiProps = PanZoomProps & {
  classes?: typeof defaultClasses;
  /**
   * @default "Use two fingers to pan and zoom"
   */
  message?: string;
};

export class PanZoomUi {
  #buttons: HTMLElement;
  #warning: HTMLElement;
  #instance: PanZoom;
  #container: HTMLElement;

  constructor({
    container,
    classes = defaultClasses,
    message = defaultMessage,
    ...rest
  }: PanZoomUiProps) {
    this.#container = container;
    this.#instance = new PanZoom({ container, ...rest });

    const buttons = document.createElement("div");
    buttons.innerHTML = `
      <button class="${classes.zoomIn}" tabindex="-1">+</button>
      <button class="${classes.reset}" tabindex="-1">↺</button>
      <button class="${classes.zoomOut}" tabindex="-1">-</button>
    `;
    buttons.className = classes.buttons;
    buttons.querySelectorAll("button").forEach((button, i) => {
      if (i == 0)
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          this.#instance.zoom(1.1);
        });
      if (i == 1)
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          this.#instance.reset();
        });
      if (i == 2)
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          this.#instance.zoom(0.9);
        });
    });
    buttons.addEventListener("dblclick", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.#buttons = buttons;

    const warningText = document.createElement("p");
    warningText.innerText = message;

    const warning = document.createElement("div");
    warning.className = classes.tsWarning;
    warning.append(warningText);

    this.#instance.onOneFingerDrag((flag) =>
      flag
        ? warning.classList.add(classes.tsWarningActive)
        : warning.classList.remove(classes.tsWarningActive)
    );
    this.#warning = warning;
  }

  on() {
    this.#instance.on();
    this.#container.append(this.#warning);
    this.#container.append(this.#buttons);
  }

  off() {
    this.#instance.off();
    this.#warning.remove();
    this.#buttons.remove();
  }
}
