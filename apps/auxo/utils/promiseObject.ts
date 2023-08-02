type PromiseObject<T> = { [K in keyof T]: Promise<T[K]> | T[K] };

/**
 * When working with Promise.all, we rely on the index number to differentiate between results.
 * Aside from being annoying, this reduces readability and maintainability with larger arrays.
 * Additionally, you can run into type checking issues when dynamically constructing arrays of promises.
 *
 * This function handles the structuring and destructuring of promise.all to and from a keyed object.
 * It uses the native Typescript Awaited type, so requires Typescript 4.5
 *
 * @param obj an object in the format { key: Promise<any> | any }
 * @returns the original object, with all promises awaited
 *
 * Example:
 *
 *  ```ts
 *  const auxo: ethers.Contract = useAuxoContract();
 *  promiseObject({
 *      totalUnderlying: auxo.totalUnderlying(),
 *      lastHarvest: auxo.lastHarvest(),
 *  })
 * .then(({ lastHarvest }) => console.debug({ lastHarvest }))
 * ```
 */
export const promiseObject = async <T>(obj: PromiseObject<T>): Promise<T> => {
  const promises: PromiseObject<T>[keyof T][] = [];
  const keys = Object.keys(obj) as Array<keyof T>;

  keys.forEach((key) => promises.push(obj[key]));

  try {
    const results = await Promise.allSettled(promises);

    return results.reduce((map, current, index) => {
      const key = keys[index];
      if (current.status === 'fulfilled') {
        map[key] = current.value as Awaited<{ [K in keyof T]: T[K] }[keyof T]>;
      }
      return map;
    }, {} as T);
  } catch (e) {
    console.error('Promise Object Call Failed', e);
    return {} as T;
  }
};
