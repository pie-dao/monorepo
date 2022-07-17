import { SupportedChain } from '@shared/util-types';

export class ContractNotFoundError extends Error {
  public kind: 'ContractNotFoundError' = 'ContractNotFoundError';
  constructor(public address: string, public chain: SupportedChain) {
    super(`Contract with address ${address} was not found on chain ${chain}.`);
  }
}
