import { render } from "@pintora/cli";
// import type { CLIRenderOptions } from '@pintora/cli/lib/render'
// import type { PintoraConfig } from '@pintora/core/lib/config'

export const pintoraSvg = async (code: string, className?: string) => {
  let svg = (await render({ code, mimeType: "image/svg+xml" })) as string;

  // can't remove width and height, because there is no viewport
  // svg = svg.replace(/\s+width="\d+[^"]+"/, "");
  // svg = svg.replace(/\s+height="\d+[^"]+"/, "");
  return `<figure class="beoe pintora ${className || ""}">${svg}</figure>`;
};
