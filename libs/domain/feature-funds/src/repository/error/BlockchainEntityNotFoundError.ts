import { SupportedChain } from '@shared/util-types';

export class BlockchainEntityNotFoundError extends Error {
  public kind: 'BlockchainEntityNotFoundError' =
    'BlockchainEntityNotFoundError';
  constructor(public address: string, public chain: SupportedChain) {
    super(
      `Blockchain entity with address ${address} was not found on chain ${chain}.`,
    );
  }
}
