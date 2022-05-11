import BigNumber from 'bignumber.js';

export type Pie = {
  name: string;
  symbol: string;
  address: string;
  history: PieHistory[];
  coingeckoId: string;
};

export type PieHistory = {
  timestamp: string;
  nav: number;
  decimals: number;
  marginalTVL: BigNumber;
  totalSupply: BigNumber;
  underlyingAssets: UnderlyingAsset[];
};

export type UnderlyingAsset = {
  address: string;
  amount: string;
  usdPrice: string;
  symbol?: string;
  price?: Record<string, number>;
  decimals?: number;
  marginalTVL?: BigNumber;
  marginalTVLPercentage?: number;
};
