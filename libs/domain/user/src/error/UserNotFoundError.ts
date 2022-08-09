export class UserNotFoundError extends Error {
  public kind: 'UserNotFoundError' = 'UserNotFoundError';
  constructor(public id: string) {
    super(`User with id ${id} not found`);
  }
}
