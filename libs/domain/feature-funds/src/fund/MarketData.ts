import { SupportedCurrency } from './SupportedCurrency';

export type CurrencyData = {
  currency: SupportedCurrency;
  price: number;
  marketCap: number;
  volume: number;
};

/**
 * Represents the market state for a token at the given `timestamp`.
 */
export type MarketData = {
  marketCapRank: number;
  circulatingSupply: number;
  timestamp: Date;
  currencyData: Array<CurrencyData>;
};
