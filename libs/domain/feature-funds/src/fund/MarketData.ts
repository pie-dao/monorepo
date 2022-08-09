import { SupportedCurrency } from '@shared/util-types';

export type CurrencyData = {
  price: number;
  marketCap: number;
  currency: SupportedCurrency;
  volume: number;
  priceChange24h?: number;
  priceChangePercentage24h?: number;
  ath?: number;
  atl?: number;
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
