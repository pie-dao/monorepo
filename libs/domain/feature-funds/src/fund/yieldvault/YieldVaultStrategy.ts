import { DataTransferError } from '@hexworks/cobalt-http';
import * as TE from 'fp-ts/TaskEither';
import { Strategy } from '../Strategy';

export enum CompoundingFrequency {
  DAILY = 365,
  WEEKLY = 52,
  MONTHLY = 12,
}

export type APRBreakdown = {
  tradingAPR: number;
  farmingAPR: number;
};

export type APYBreakdown = APRBreakdown & {
  tradingAPY: number;
  farmingAPY: number;
  totalAPY: number;
};

export class CurveAPIError extends Error {
  public kind: 'CurveAPIError' = 'CurveAPIError';
  constructor(poolSymbol: string) {
    super(`Couldn't find ${poolSymbol} in Curve API.`);
  }
}

export class EthersError extends Error {
  public kind: 'EthersError' = 'EthersError';
  constructor(cause: unknown) {
    super(`Ethers call failed: ${cause}`);
  }
}

export type StrategyCalculationError =
  | CurveAPIError
  | EthersError
  | DataTransferError;

export interface YieldVaultStrategy extends Strategy {
  /**
   * Calculates the APR for this strategy.
   *
   * Annual percentage rate (APR) refers to the yearly interest generated
   * by this strategy. This includes any fees or additional costs but does not
   * take compounding into account.
   */
  calculateAPR(): TE.TaskEither<StrategyCalculationError, APRBreakdown>;

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
   * @param years How many years the APY is calculated for.
   */
  simulateAPY(
    compoundingFrequency: number,
    years: number,
  ): TE.TaskEither<StrategyCalculationError, APYBreakdown>;
}
