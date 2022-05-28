/**
 * Represents a token on the Ethereum blockchain.
 */
export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  /**
   * The kind of this `Token`. This property can be used
   * to create tagged unions.
   */
  kind: string;
};

/**
 * Represents a yield-bearing version of a token, eg:
 * `stETH` vs `ETH`.
 */
export type YieldBearingToken = Token & {
  kind: 'YieldBearingToken';
  wrappedToken: Token;
};
