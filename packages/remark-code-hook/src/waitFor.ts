const pending: WeakMap<any, Promise<any>> = new WeakMap();
const resolved: WeakMap<any, any> = new WeakMap();

export const waitFor =
  <A, B, C>(
    toWait: () => Promise<A>,
    toExecute: (x: A) => (x: B) => C | Promise<C>
  ) =>
  (x: B): C | Promise<C> => {
    if (resolved.has(toWait)) {
      return resolved.get(toWait)(x);
    }

    if (!pending.has(toWait)) {
      pending.set(
        toWait,
        toWait()
          .then((y) => {
            resolved.set(toWait, toExecute(y));
            pending.delete(toWait);
          })
          .catch((e) => {
            pending.delete(toWait);
            throw e;
          })
      );
    }

    return pending.get(toWait)!.then(() => resolved.get(toWait)(x));
  };
