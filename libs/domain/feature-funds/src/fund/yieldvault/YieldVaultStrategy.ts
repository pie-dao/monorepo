import { Strategy } from '../Strategy';

export enum CompoundingFrequency {
  DAILY = 365,
  WEEKLY = 52,
  MONTHLY = 12,
}

export interface YieldVaultStrategy extends Strategy {
  /**
   * Calculates the APR for this strategy.
   *
   * Annual percentage rate (APR) refers to the yearly interest generated
   * by this strategy. This includes any fees or additional costs but does not
   * take compounding into account.
   */
  calculateAPR(): number;

  /**
   * Simulates the APY for this strategy for the given compounding frequency.
   *
   * Though an APR only accounts for simple interest, the annual percentage
   * yield (APY) takes compound interest into account. As a result, APY is
   * higher than APR. The higher the interest rate — and to a lesser extent,
   * the smaller the compounding periods — the greater the difference between
   * the APR and APY.
   *
   * @param compoundingFrequency How many times the APR is compounded per year.
   */
  simulateAPY(compoundingFrequency: number): number;
}
