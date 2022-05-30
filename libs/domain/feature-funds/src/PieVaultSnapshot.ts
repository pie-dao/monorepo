import { BigNumber } from 'ethers';
import { Address } from './Address';
import { FundSnapshot } from './FundSnapshot';
import { Token } from './Token';

/**
 * Represents the state of a {@link PieVault} at the given {@link timestamp}.
 */
export type PieVaultSnapshot = FundSnapshot & {
  timestamp: Date;
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

  underlyingTokens: TokenDetails[];
};

export type TokenDetails = {
  token: Token;
  balance: BigNumber;
};
