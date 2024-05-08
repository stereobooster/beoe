export const identity = new DOMMatrix([1, 0, 0, 1, 0, 0]);

export function ttm(m: DOMMatrix) {
  return m.toString();
}

export function transformXY(m: DOMMatrix, x: number, y: number) {
  const newPoint = new DOMPointReadOnly(x, y).matrixTransform(m);
  return [newPoint.x, newPoint.y] as const;
}

export function getScale(m: DOMMatrix) {
  return m.a;
}

export function scale(m: DOMMatrix, sf: number) {
  return m.scale(sf);
}

export function scaleAt(m: DOMMatrix, sf: number, x: number, y: number) {
  const scaleMatrix = scale(m, sf);
  const [nx1, ny1] = transformXY(m.inverse(), x, y);
  const [nx2, ny2] = transformXY(scaleMatrix.inverse(), x, y);
  return translate(scaleMatrix, nx2 - nx1, ny2 - ny1);
}

export function translate(m: DOMMatrix, dx: number, dy: number) {
  return m.translate(dx, dy);
}
