import BigNumber from 'bignumber.js';

/**
 * Open, high, low, close data type.
 */
export type OHLC = {
  open: BigNumber;
  high: BigNumber;
  low: BigNumber;
  close: BigNumber;
};

/**
 * Represents the market state for a token at the given `timestamp`.
 */
export type TokenMarketData = {
  currentPrice: BigNumber;
  marketCap: BigNumber;
  marketCapRank: number;
  totalVolume: BigNumber;
  circulatingSupply: BigNumber;
  tvl: BigNumber;
  timestamp: Date;
  ohlc: OHLC[];
};
