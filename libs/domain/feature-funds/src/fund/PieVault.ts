import * as E from 'fp-ts/Either';
import {
  Fund,
  MarketData,
  PieVaultHistory,
  SupportedChain,
  Token,
  TokenDetails,
} from '.';
import { TokenNotFoundError } from '../repository';

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

  private latest?: PieVaultHistory;

  constructor(
    public chain: SupportedChain,
    public address: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public history: PieVaultHistory[] = [],
    public marketData: MarketData[] = [],
  ) {
    this.latest = history.length > 0 ? history[history.length - 1] : undefined;
  }

  /**
   * Tells whether this fund has an allocation for the given {@link Token}.
   */
  public hasToken(token: Token): boolean {
    return (
      this.latest?.underlyingTokens.some(
        (underlying) => underlying.token.address === token.address,
      ) ?? false
    );
  }

  /**
   * Returns the details for a given {@link Token} in this {@link Fund}.
   * @returns either the {@link TokenDetails} or an {@link Error} if it was missing.
   */
  public getUnderlyingToken(token: Token): E.Either<Error, TokenDetails> {
    if (this.hasToken(token)) {
      return E.right(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.latest!.underlyingTokens.find(
          (t) => t.token.address === token.address,
        )!,
      );
    } else {
      return E.left(new TokenNotFoundError(token.address, token.chain));
    }
  }
}
