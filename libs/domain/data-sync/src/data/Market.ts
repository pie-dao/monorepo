import { SupportedCurrency } from '@domain/feature-funds';

export type Market = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  fullyDilutedValuation: number | null;
  totalVolume: number;
  high24h: number | null;
  low24h: number | null;
  priceChange24h: number | null;
  priceChangePercentage24h: number | null;
  marketCapChange24h: number | null;
  marketCapChangePercentage24h: number | null;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  ath: number;
  athChangePercentage: number;
  athDate: Date;
  atl: number;
  atlChangePercentage: number;
  atlDate: Date;
  roi: {
    times: number;
    currency: SupportedCurrency;
    percentage: number;
  } | null;
  updatedAt: Date;
  hourlyPriceChangePercentage: number | null;
  dailyPriceChangePercentage: number | null;
};
