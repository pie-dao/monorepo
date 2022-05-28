import { BigNumber } from 'ethers';
import { Address } from './Address';
import { Token } from './Token';

/**
 * Pie Smart Pools are non-custodial smart contracts, the first implementation of a DAO-governed AMM pool.
 * They add extra functionality on top of vanilla AMMs pools.
 *
 * Providing liquidity to one of these Pies gets you tokenized exposure to the underlying assets
 * and additionally generates yield from the liquidity in these pools to perform token swaps.
 *
 * The Pie Smart Pools are asset management agnostic. At the time of writing, Pie Smart Pools
 * are compatible with the Balancer interface.
 */
export type PieSmartPool = Token & {
  kind: 'PieSmartPool';

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
