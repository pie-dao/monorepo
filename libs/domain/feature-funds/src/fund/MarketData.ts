import { SupportedCurrency } from '@shared/util-types';

export type CurrencyData = {
  price: number;
  marketCap: number;
  currency: SupportedCurrency;
  nav: number;
  ath?: number;
  atl?: number;
};

/**
 * Represents the market state for a token at the given `timestamp`.
 */
export type MarketData = {
  circulatingSupply: number;
  timestamp: Date;
  currencyData: Array<CurrencyData>;
  marketCapRank?: number;
};
