import { getScale, identity, scaleAt, translate, ttm } from "./utilsDom.js";
import { Coords, center, centerDiff, distance } from "./utils.js";

export type PanZoomProps = {
  /**
   * svg, img, picture, div or anything else
   */
  element: HTMLElement | SVGSVGElement;
  container: HTMLElement;
};

export class PanZoom {
  #element: HTMLElement | SVGSVGElement;
  #container: HTMLElement;
  #curMatrix = identity;
  #raf = 0;
  #listeners: Record<string, any>;
  #oneFinger: boolean = false;
  #oneFingerCb?: (flag: boolean) => void;

  constructor({ element, container }: PanZoomProps) {
    this.#element = element;
    this.#container = container;

    let tapedTwice = false;
    let mousedown = false;
    let originXY: Coords = [];
    let currentXY: Coords = [];

    let dragPosition: Coords = [];

    const onDblClick = (e: MouseEvent | TouchEvent) => {
      console.log(e);
      // Maybe do zoom-in/zoom-out on single click with Cmd/Alt?
      if (e.altKey) {
        // alt + DblClick = zoom out
        this.#animate();
        this.#scale(0.5, this.#getXY(e));
        this.#render();
      } else if (this.#curMatrix.isIdentity || e.metaKey) {
        // "first" DblClick = zoom in
        // Cmd + DblClick = zoom in
        this.#animate();
        this.#scale(2, this.#getXY(e));
        this.#render();
      } else {
        this.reset();
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const xy = this.#getXY(e);
      if ("touches" in e) {
        mousedown = e.touches.length === 2;
        if (e.touches.length === 1) {
          dragPosition = this.#getXY(e, false);
        } else {
          this.#fingerDrag(false);
        }
        if (mousedown) e.preventDefault();
        if (e.touches.length === 1) {
          if (tapedTwice) {
            if (distance([xy[0], originXY[0]]) > 20) {
              tapedTwice = false;
            } else {
              onDblClick(e);
            }
          } else {
            tapedTwice = true;
            setTimeout(() => (tapedTwice = false), 300);
          }
        }
      } else {
        mousedown = true;
        this.#container.style.cursor = "grabbing";
      }
      originXY = xy;
      currentXY = xy;
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        mousedown = e.touches.length === 2;
        if (e.touches.length === 0) this.#fingerDrag(false);
        if (e.touches.length === 1) dragPosition = this.#getXY(e, false);
      } else {
        mousedown = false;
        this.#container.style.cursor = "";
      }
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        const newDragPosition = this.#getXY(e, false);
        if (
          e.touches.length === 1 &&
          distance([dragPosition[0], newDragPosition[0]]) > 20
        ) {
          this.#fingerDrag(true);
        }
      }
      if (!mousedown) return;
      let xy = this.#getXY(e);
      let isPinch = false;
      if ("touches" in e) {
        if (e.touches.length !== 2) return;
        e.preventDefault();
        const originScaleFactor = distance(xy) / distance(originXY);
        isPinch = Math.abs(1 - originScaleFactor) > 0.1;
      }
      this.#translate(...centerDiff(xy, currentXY));
      if (isPinch) {
        const scaleFactor = distance(xy) / distance(currentXY);
        this.#scale(scaleFactor, xy);
      }
      this.#render();
      currentXY = xy;
    };

    const onWheel = (e: WheelEvent) => {
      // pinch gesture on trackpad/touchpad or Ctrl + wheel
      if (e.ctrlKey) {
        e.preventDefault();
        this.#scale(1 - e.deltaY * 0.01, this.#getXY(e));
        this.#render();
      }
    };

    this.#listeners = {
      touchstart: onPointerDown,
      touchend: onPointerUp,
      touchmove: onPointerMove,
      touchcancel: onPointerUp,
      wheel: onWheel,
      mousedown: onPointerDown,
      mouseup: onPointerUp,
      mouseleave: onPointerUp,
      mousemove: onPointerMove,
      dblclick: onDblClick,
    };
  }

  #getXY(e: MouseEvent | TouchEvent, layer = true) {
    let coords: Coords =
      "touches" in e
        ? Array.from(e.touches).map((t) => [t.clientX, t.clientY])
        : [[e.clientX, e.clientY]];

    if (layer) {
      const rect = this.#container.getBoundingClientRect();
      coords = coords.map(([x, y]) => [
        x - rect.x - rect.width / 2,
        y - rect.y - rect.height / 2,
      ]);
    }

    return coords;
  }

  #render() {
    cancelAnimationFrame(this.#raf);
    this.#raf = window.requestAnimationFrame(() => {
      this.#element.style.transform = ttm(this.#curMatrix);
    });
  }

  #translate(dx: number, dy: number) {
    const currentScale = getScale(this.#curMatrix);
    this.#curMatrix = translate(
      this.#curMatrix,
      dx / currentScale,
      dy / currentScale
    );
  }

  #scale(scaleFactor: number, xy: Coords) {
    const [x, y] = center(xy);
    this.#curMatrix = scaleAt(this.#curMatrix, scaleFactor, x, y);
  }

  #animate() {
    const t = 300;
    this.#element.style.transitionProperty = "transform";
    this.#element.style.transitionDuration = `${t}ms`;
    setTimeout(() => {
      this.#element.style.transitionDuration = "";
      this.#element.style.transitionProperty = "";
    }, t);
  }

  #fingerDrag(one: boolean) {
    if (this.#oneFinger === one) return;
    this.#oneFinger = one;
    this.#oneFingerCb && this.#oneFingerCb(one);
  }

  onOneFingerDrag(cb: (flag: boolean) => void) {
    this.#oneFingerCb = cb;
  }

  reset() {
    this.#animate();
    this.#curMatrix = identity;
    this.#render();
  }

  pan(dx: number, dy: number) {
    this.#animate();
    this.#translate(dx, dy);
    this.#render();
  }

  zoom(scaleFactor: number) {
    this.#animate();
    // scale relevant to the center
    this.#scale(scaleFactor, [[0, 0]]);
    this.#render();
  }

  on() {
    Object.entries(this.#listeners).forEach(([name, handler]) => {
      // I can add `{ passive: true }`, which would remove junk during scroll, but it will break zoom
      // Maybe I can lock scroll? But I need to know closest scrollable parent?
      // Maybe I can change listeners on the fly as soon as the first zoom detected?
      // Maybe I can scroll back?
      this.#container.addEventListener(name, handler);
    });
  }

  off() {
    Object.entries(this.#listeners).forEach(([name, handler]) => {
      this.#container.removeEventListener(name, handler);
    });
  }
}
