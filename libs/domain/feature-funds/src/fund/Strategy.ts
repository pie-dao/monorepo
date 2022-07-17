import { Contract } from './Contract';
import { Token } from './Token';

/**
 * A strategy is a contract that implements a yield-generating algorithm.
 * It is attached to one or more vault(s).
 */
export interface Strategy extends Contract {
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
