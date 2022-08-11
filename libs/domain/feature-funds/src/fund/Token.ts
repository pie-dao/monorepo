import { Contract, MarketData } from '.';

/**
 * Represents a token on a blockchain. Note that a token can be uniquely identified
 * by its address on a blockchain (`chain` + `address`).
 */
export interface Token extends Contract {
  symbol: string;
  name: string;
  decimals: number;
  /**
   * The identifier for this token on Coin Gecko.
   */
  coinGeckoId: string;
  /**
   * (Temporal) market data for this token.
   */
  marketData: MarketData[];
}

/**
 * Represents a yield-bearing version of a token, eg:
 * `stETH` vs `ETH`.
 */
export type YieldBearingToken = Token & {
  kind: 'YieldBearingToken';
  wrappedToken: Token;
};
