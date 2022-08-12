import * as TE from 'fp-ts/TaskEither';

export const sleep = <E>(ms: number): TE.TaskEither<E, unknown> =>
  TE.fromTask(() => new Promise((resolve) => setTimeout(resolve, ms)));
