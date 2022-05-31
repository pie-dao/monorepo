import * as E from 'fp-ts/Either';
import { Fund } from './Fund';
import { PieVaultSnapshot, TokenDetails } from './PieVaultSnapshot';
import { Token } from './Token';

/**
 * Pie Vaults are an evolution of Pie Smart Pools, but without the swapping functionality.
 *
 * Weights can also be changed in Pie Vaults but rebalancing is not automatic.
 *
 * What Pie Vaults add to the mix is the ability to directly interact with smart
 * contracts and DeFi protocols. This includes staking and lending. For example,
 * SUSHI` can be supplied to a Pie Vault and then `SUSHI` can be staked tO get `xSUSHI`.
 *
 * Note that *Pie Vaults only work with tokens that have a tokenized representation
 * of the strategy* (for example `SUSHI` + `xSUSHI`).
 */
export type PieVault = Fund<PieVaultSnapshot> & {
  kind: 'PieVault';
  /**
   * Represents the temporal evolution of the Fund's state.
   */
  snapshots: PieVaultSnapshot[];

  /**
   * Tells whether this fund has an allocation for the given {@link Token}.
   */
  hasToken: (token: Token) => boolean;

  /**
   * Returns the details for a given {@link Token} in this {@link Fund}.
   * @returns either the {@link TokenDetails} or an {@link Error} if it was missing.
   */
  getUnderlyingToken: (token: Token) => E.Either<Error, TokenDetails>;
};
