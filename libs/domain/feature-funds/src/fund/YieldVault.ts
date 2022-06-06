import { Fund } from './Fund';
import { YieldVaultHistory } from './YieldVaultHistory';

/**
 * Yield Vaults can be used to tokenize a yield-generating strategy for those tokens that don't have one.
 *
 * A fund type holds
 */
export class YieldVault implements Fund<YieldVaultHistory> {
  public kind: 'YieldVault' = 'YieldVault';
  constructor(
    public address: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public history: YieldVaultHistory[] = [],
  ) {}
}
