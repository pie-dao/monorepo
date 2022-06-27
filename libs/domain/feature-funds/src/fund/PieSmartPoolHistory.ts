import { BigNumber } from 'bignumber.js';
import { FundHistory } from './FundHistory';
import { Token } from './Token';

/**
 * Represents the state of a {@link PieSmartPool} at the given {@link timestamp}.
 */
export type PieSmartPoolHistory = FundHistory & {
  /**
   * The current tokens in the smart pool.
   */
  underlyingTokens: Token[];

  /**
   * The string of the controller.
   */
  controller: string;

  /**
   * The string of the public swap setter.
   */
  publicSwapSetter: string;

  /**
   * The string of the token binder.
   */
  tokenBinder: string;

  /**
   * The string of the circuit breaker.
   */
  circuitBreaker: string;

  /**
   * Tells if public swapping is enabled.
   */
  publicSwapEnabled: boolean;

  /**
   * The current cap in wei.
   */
  cap: BigNumber;

  annualFee: BigNumber;

  feeRecipient: string;

  /**
   * The string of the underlying Balancer pool.
   */
  balancerPoolAddress: string;

  /**
   * The current swap fee.
   */
  swapFee: BigNumber;

  denormalizedWeights: TokenWeight[];

  /**
   * The target weights.
   */
  targetWeights: TokenWeight[];

  /**
   * The weights at start of weight adjustment.
   */
  startWeights: TokenWeight[];

  /**
   * The start block of weight adjustment.
   */
  startBlock?: BigNumber;

  /**
   * The end block of weight adjustment.
   */
  endBlock?: BigNumber;

  /**
   * Tells if joining and exiting is enabled.
   */
  joinExitEnabled: boolean;
};

export type TokenWeight = {
  token: Token;
  weight: BigNumber;
};
