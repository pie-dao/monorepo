import { BigNumber } from 'ethers';
import { Address } from './Address';
import { FundSnapshot } from './FundSnapshot';
import { Token } from './Token';

/**
 * Represents the state of a {@link PieSmartPool} at the given {@link timestamp}.
 */
export type PieSmartPoolSnapshot = FundSnapshot & {
  timestamp: Date;

  /**
   * The current tokens in the smart pool.
   */
  underlyingTokens: Token[];

  /**
   * The address of the controller.
   */
  controller: Address;

  /**
   * The address of the public swap setter.
   */
  publicSwapSetter: Address;

  /**
   * The address of the token binder.
   */
  tokenBinder: Address;

  /**
   * The address of the circuit breaker.
   */
  circuitBreaker: Address;

  /**
   * Tells if public swapping is enabled.
   */
  publicSwapEnabled: boolean;

  /**
   * The current cap in wei.
   */
  cap: BigNumber;

  annualFee: BigNumber;

  feeRecipient: Address;

  /**
   * The address of the underlying Balancer pool.
   */
  balancerPoolAddress: Address;

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
  startBlock: BigNumber;

  /**
   * The end block of weight adjustment.
   */
  endBlock: BigNumber;

  /**
   * Tells if joining and exiting is enabled.
   */
  joinExitEnabled: boolean;
};

type TokenWeight = {
  token: Token;
  weight: BigNumber;
};
