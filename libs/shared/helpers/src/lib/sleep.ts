import * as T from 'fp-ts/Task';

export const sleep =
  (ms: number): T.Task<unknown> =>
  () =>
    new Promise((resolve) => setTimeout(resolve, ms));
