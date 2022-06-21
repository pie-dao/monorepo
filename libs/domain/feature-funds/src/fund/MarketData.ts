import { SupportedCurrency } from './SupportedCurrency';

export type CurrencyAmount = {
  currency: SupportedCurrency;
  amount: number;
};

/**
 * Represents the market state for a token at the given `timestamp`.
 */
export type MarketData = {
  currentPrice: Array<CurrencyAmount>;
  marketCap: Array<CurrencyAmount>;
  totalVolume: Array<CurrencyAmount>;
  marketCapRank: number;
  circulatingSupply: number;
  timestamp: Date;
};
