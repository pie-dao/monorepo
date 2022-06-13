import { Chain, TokenMarketData } from '.';

/**
 * Represents a token on a blockchain. Note that a token can be uniquely identified
 * by its address on a blockchain (`chain` + `address`).
 */
export type Token = {
  /**
   * The chain on which token resides.
   */
  chain: Chain;
  /**
   * The address where this token is deployed. This is important
   * because `name` and `symbol` are not unique according to the
   * ERC-20 specification.
   */
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  /**
   * The kind of this `Token`. This property can be used
   * to create tagged unions.
   */
  kind: string;
  /**
   * (Temporal) market data for this token.
   */
  tokenMarketData: TokenMarketData[];
};

/**
 * Represents a yield-bearing version of a token, eg:
 * `stETH` vs `ETH`.
 */
export type YieldBearingToken = Token & {
  kind: 'YieldBearingToken';
  wrappedToken: Token;
};
