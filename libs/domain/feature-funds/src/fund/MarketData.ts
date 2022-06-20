import BigNumber from 'bignumber.js';

/**
 * Open, high, low, close data type.
 */
export type OHLC = {
  open: BigNumber;
  high: BigNumber;
  low: BigNumber;
  close: BigNumber;
  from: Date;
  to: Date;
};

/**
 * Represents the market state for a token at the given `timestamp`.
 */
export type MarketData = {
  currentPrice: BigNumber;
  marketCap: BigNumber;
  marketCapRank: number;
  totalVolume: BigNumber;
  circulatingSupply: BigNumber;
  tvl: BigNumber;
  timestamp: Date;
  ohlc: OHLC[];
};
