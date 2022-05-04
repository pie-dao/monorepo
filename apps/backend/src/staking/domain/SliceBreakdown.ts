import { UnderlyingAsset } from 'src/pies/domain/pie';

export type SLICEBreakdown = {
  nav: number;
  totalSupply: string;
  decimals: number;
  symbol: string;
  underlying: UnderlyingAsset[];
};
