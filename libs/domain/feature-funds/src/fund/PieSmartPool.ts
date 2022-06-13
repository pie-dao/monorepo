import { Chain, Fund, PieSmartPoolHistory, TokenMarketData } from '.';

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
export class PieSmartPool implements Fund<PieSmartPoolHistory> {
  public kind: 'PieSmartPool' = 'PieSmartPool';
  constructor(
    public chain: Chain,
    public address: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public history: PieSmartPoolHistory[] = [],
    public tokenMarketData: TokenMarketData[] = [],
  ) {}
}
