import { expect, it, describe } from "vitest";
import fs from "node:fs/promises";

import { dotToSvg } from "../src/dotToSvg";

function example(x: number) {
  it(`example ${x}`, async () => {
    const file = await dotToSvg(
      (
        await fs.readFile(new URL(`./dotToSvg/${x}.dot`, import.meta.url))
      ).toString()
    );

    expect(file.toString()).toMatchFileSnapshot(`./dotToSvg/${x}.svg`);
  });
}

describe("dotToSvg", () => {
  example(1);
  example(2);
  // I have no idea how to set rank
  // example(3);
  example(7);
  // parser doesn't support it
  // example(8);
  example(10);
  example(11);
});
