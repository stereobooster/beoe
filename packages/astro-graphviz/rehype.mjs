import { getCache } from "@datt/cache";
import {
  rehypeGraphviz as defaultRehypeGraphviz,
  graphvizSvg,
} from "@datt/rehype-graphviz";

export { graphvizSvg };

const cache = await getCache();

export const rehypeGraphviz = (options = {}) => {
  // @ts-expect-error
  return defaultRehypeGraphviz({
    cache,
    ...options,
  });
};
