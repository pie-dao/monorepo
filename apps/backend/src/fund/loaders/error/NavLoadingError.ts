export class ContractExecutionError extends Error {
  public kind: 'ContractExecutionError' = 'ContractExecutionError';
  constructor(public cause: unknown) {
    super(`Contract execution failed: ${cause}`);
  }
}
