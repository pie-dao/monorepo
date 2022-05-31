import { Fund } from './Fund';
import { PieSmartPoolSnapshot } from './PieSmartPoolSnapshot';

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
export type PieSmartPool = Fund<PieSmartPoolSnapshot> & {
  kind: 'PieSmartPool';
  /**
   * Represents the temporal evolution of the Fund's state.
   */
  snapshots: PieSmartPoolSnapshot[];
};
