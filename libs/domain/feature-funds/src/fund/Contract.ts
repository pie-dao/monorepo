import { SupportedChain } from '@shared/util-types';

/**
 * Represents a blockchain contract. Note that a contract can be uniquely identified
 * by its address on a blockchain (`chain` + `address`).
 */
export type Contract = {
  /**
   * The chain on which token resides.
   */
  chain: SupportedChain;
  /**
   * The address where this contract is deployed.
   */
  address: string;
  /**
   * The kind of this `Contract`. This property can be used
   * to create tagged unions.
   */
  kind: string;
};
