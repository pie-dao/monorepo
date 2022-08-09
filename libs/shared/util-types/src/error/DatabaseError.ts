export class DatabaseError extends Error {
  public kind: 'DatabaseError' = 'DatabaseError';
  constructor(public cause: unknown) {
    super(`Database operation failed: ${cause}`);
  }
}
