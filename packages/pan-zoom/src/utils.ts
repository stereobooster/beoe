export type Coords = Array<[number, number]>;

export function center(coords: Coords) {
  return coords.length > 1
    ? coords
        .reduce(([xAcc, yAcc], [x, y]) => [xAcc + x, yAcc + y], [0, 0])
        .map((k) => k / coords.length)
    : coords[0];
}

export function centerDiff(co1: Coords, co2: Coords) {
  const c1 = center(co1);
  const c2 = center(co2);
  return [c1[0] - c2[0], c1[1] - c2[1]] as const;
}

export function distance(c: Coords) {
  return c.length === 2
    ? Math.sqrt(Math.pow(c[0][0] - c[1][0], 2) + Math.pow(c[0][1] - c[1][1], 2))
    : 0;
}
