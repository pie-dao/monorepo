import { EntityNotFoundError, SupportedChain } from '@shared/util-types';
import * as E from 'fp-ts/Either';
import { Fund } from '../Fund';
import { MarketData } from '../MarketData';
import { Token } from '../Token';
import { PieVaultHistory, TokenDetails } from './PieVaultHistory';

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
export class PieVault implements Fund<PieVaultHistory> {
  public kind: 'PieVault' = 'PieVault';
  latest?: PieVaultHistory;

  constructor(
    public chain: SupportedChain,
    public address: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public coinGeckoId: string,
    public history: PieVaultHistory[] = [],
    public marketData: MarketData[] = [],
  ) {
    this.latest = history.length > 0 ? history[0] : undefined;
  }
}
