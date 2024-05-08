import * as math from "mathjs";

export const identity = math.matrix([
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]);

// this causes pixelation in Safari
// export function ttm(m: math.Matrix) {
//   return `matrix3d(${[
//     [m.get([0, 0]), m.get([1, 0]), 0, 0],
//     [m.get([0, 1]), m.get([1, 1]), 0, 0],
//     [0, 0, 1, 0],
//     [m.get([0, 2]), m.get([1, 2]), 0, 1],
//   ]})`;
// }

export function ttm(m: math.Matrix) {
  return `matrix(${[
    m.get([0, 0]),
    m.get([1, 0]),
    m.get([0, 1]),
    m.get([1, 1]),
    m.get([0, 2]),
    m.get([1, 2]),
  ]})`;
}

export function transformXY(m: math.Matrix, x: number, y: number) {
  const nm = math.multiply(m, [x, y, 1]);
  return [nm.get([0]), nm.get([1])] as const;
}

export function getScale(m: math.Matrix) {
  return m.get([0, 0]);
}

export function scale(m: math.Matrix, sf: number) {
  return math.multiply(
    m,
    math.matrix([
      [sf, 0, 0],
      [0, sf, 0],
      [0, 0, 1],
    ])
  );
}

export function scaleAt(m: math.Matrix, sf: number, x: number, y: number) {
  const scaleMatrix = scale(m, sf);
  const [nx1, ny1] = transformXY(math.inv(m), x, y);
  const [nx2, ny2] = transformXY(math.inv(scaleMatrix), x, y);
  return translate(scaleMatrix, nx2 - nx1, ny2 - ny1);
}

export function translate(m: math.Matrix, dx: number, dy: number) {
  return math.multiply(
    m,
    math.matrix([
      [1, 0, dx],
      [0, 1, dy],
      [0, 0, 1],
    ])
  );
}

export function fdm(m: DOMMatrix) {
  return math.matrix([
    [m.a, m.c, m.e],
    [m.b, m.d, m.f],
    [0, 0, 1],
  ]);
}

export function tdm(m: math.Matrix) {
  return new DOMMatrix([
    m.get([0, 0]),
    m.get([1, 0]),
    m.get([0, 1]),
    m.get([1, 1]),
    m.get([0, 2]),
    m.get([1, 2]),
  ]);
}

// export function m3d(m: DOMMatrix) {
//   return `matrix3d(${[
//     [m.m11, m.m12, m.m13, m.m14],
//     [m.m21, m.m22, m.m23, m.m24],
//     [m.m31, m.m32, m.m33, m.m34],
//     [m.m41, m.m42, m.m43, m.m44],
//   ]})`;
// }
