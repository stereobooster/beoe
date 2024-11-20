import { getCache } from "@beoe/cache";
import {
  rehypeGraphviz as defaultRehypeGraphviz,
  graphvizSvg,
} from "@beoe/rehype-graphviz";

export { graphvizSvg };

const cache = await getCache();

export const rehypeGraphviz = (options = {}) => {
  // @ts-expect-error
  return defaultRehypeGraphviz({
    cache,
    ...options,
  });
};
