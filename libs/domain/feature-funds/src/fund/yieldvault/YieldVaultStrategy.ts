import { SupportedChain } from '@shared/util-types';
import BigNumber from 'bignumber.js';
import { Token } from '../Token';

export type YieldVaultStrategy = {
  /**
   * The chain on which this strategy resides.
   */
  chain: SupportedChain;

  /**
   * The address where this strategy is deployed.
   */
  address: string;

  name: string;

  /**
   * The kind of this `Token`. This property can be used
   * to create tagged unions.
   */
  kind: string;

  /**
   * The underlying token the strategy accepts.
   */
  underlyingToken: Token;

  /**
   * The amount of underlying tokens deposited in this strategy.
   */
  depositedAmount: BigNumber;

  /**
   * The estimated amount of underlying tokens managed by the strategy.
   */
  estimatedAmount: BigNumber;

  /**
   * The strategy manager.
   */
  manager: string;

  /**
   * The strategist (TODO: who is this?)
   */
  strategist: string;

  /**
   * Tells whether the Vault will operate on the strategy.
   */
  trusted: boolean;
  /**
   * Used to determine profit and loss during harvests of the strategy.
   */
  balance: BigNumber;
};
