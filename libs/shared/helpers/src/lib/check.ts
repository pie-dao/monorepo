export class CheckFailedError extends Error {
  public kind: 'CheckFailedError' = 'CheckFailedError';
  constructor(message: string) {
    super(message);
  }
}

/**
 * Requires `condition` to be true. If it is false it throws an Error.
 */
export const check = (condition: boolean, message: string) => {
  if (!condition) {
    throw new CheckFailedError(message);
  }
};
