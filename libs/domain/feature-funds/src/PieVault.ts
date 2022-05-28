import { BigNumber } from 'ethers';
import * as E from 'fp-ts/Either';
import { Address } from './Address';
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
export type PieVault = Token & {
  kind: 'PieVault';
  /**
   * The entry fee paid when minting.
   * This is a percentage value. 1e18 == 100%. Capped at 100%.
   */
  entryFee: BigNumber;

  /**
   * The fee paid when exiting the fund.
   * This is a percentage value. 1e18 == 100%. Capped at 100%.
   */
  exitFee: BigNumber;

  /**
   * Fee paid annually. Often referred to as streaming fee.
   * This is a percentage value. 1e18 == 100%. Capped at 100%.
   */
  annualizedFee: BigNumber;

  /**
   * The address receiving the fees.
   */
  feeBeneficiary: Address;

  /**
   * The share of the entry fee that the fee beneficiary gets.
   * This is a percentage value. 1e18 == 100%. Capped at 100%.
   */
  feeBeneficiaryEntryShare: BigNumber;

  /**
   * The share of the exit fee that the fee beneficiary gets.
   * This is a percentage value. 1e18 == 100%. Capped at 100%.
   */
  feeBeneficiaryExitShare: BigNumber;

  /**
   * The outstanding annualized fee: the amount of pool tokens
   * to be minted to charge the annualized fee.
   */
  outstandingAnnualizedFeet: BigNumber;

  /**
   * Tells whether the pool is locked or not. (not accepting exit and entry)
   */
  locked: boolean;

  /**
   * The block at which the pool is unlocked.
   */
  lockedUntil: BigNumber;

  /**
   * The maximum of pool tokens that can be minted.
   */
  cap: BigNumber;

  tokens: TokenDetails[];

  /**
   * Tells whether this fund has an allocation for the given {@link Token}.
   */
  hasToken: (symbol: string) => boolean;

  /**
   * Returns the details for a given {@link Token} in this {@link Fund}.
   * @returns either the {@link TokenDetails} or an {@link Error} if it was missing.
   */
  getUnderlyingToken: (symbol: string) => E.Either<Error, TokenDetails>;
};

export type TokenDetails = {
  token: Token;
  balance: BigNumber;
};
