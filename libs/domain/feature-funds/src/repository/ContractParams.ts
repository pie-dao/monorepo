import { SupportedChain } from '@shared/util-types';

/**
 * This type contains the keys that uniquely identify a contract.
 */
export type ContractParams = {
  chain: SupportedChain;
  address: string;
};
