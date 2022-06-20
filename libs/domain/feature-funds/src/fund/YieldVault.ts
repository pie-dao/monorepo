import { Fund, SupportedChain, MarketData, YieldVaultHistory } from '.';

/**
 * Yield Vaults can be used to tokenize a yield-generating strategy for those tokens that don't have one.
 *
 * A fund type holds
 */
export class YieldVault implements Fund<YieldVaultHistory> {
  public kind: 'YieldVault' = 'YieldVault';
  constructor(
    public chain: SupportedChain,
    public address: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public history: YieldVaultHistory[] = [],
    public marketData: MarketData[] = [],
  ) {}
}
