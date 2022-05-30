import { Fund } from './Fund';
import { YieldVaultSnapshot } from './YieldVaultSnapshot';

/**
 * Yield Vaults can be used to tokenize a yield-generating strategy for those tokens that don't have one.
 *
 * A fund type holds
 */
export type YieldVault = Fund<YieldVaultSnapshot> & {
  kind: 'YieldVault';
  /**
   * Represents the temporal evolution of the Fund's state.
   */
  snapshots: YieldVaultSnapshot[];
};
