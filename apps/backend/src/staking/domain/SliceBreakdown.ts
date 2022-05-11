import { UnderlyingAsset } from '../../pies';

export type SLICEBreakdown = {
  nav: number;
  totalSupply: string;
  decimals: number;
  symbol: string;
  underlying: UnderlyingAsset[];
};
