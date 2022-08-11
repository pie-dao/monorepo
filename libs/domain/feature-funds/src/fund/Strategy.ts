import { Contract } from './Contract';
import { Token } from './Token';

export interface YieldData {
  timestamp: Date;
  apr: number;
  apy: {
    compoundingFrequency: number;
    value: number;
  };
}

/**
 * A strategy is a contract that implements a yield-generating algorithm.
 * It is attached to one or more vault(s).
 */
export interface Strategy extends Contract {
  name: string;
  yields: YieldData[];
  /**
   * The vault addresses this strategy is attached to.
   */
  vaults: string[];
  /**
   * The underlying token the strategy accepts.
   */
  underlyingToken: Token;

  /**
   * Tells whether the Vault will operate on the strategy.
   */
  trusted: boolean;
}
