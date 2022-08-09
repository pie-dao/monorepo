export class EntityNotFoundError extends Error {
  public kind: 'EntityNotFoundError' = 'EntityNotFoundError';
  constructor(public keys: Record<string, unknown>) {
    super(`Entity with keys ${JSON.stringify(keys)} not found.`);
  }
}
