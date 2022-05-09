export interface Balances {
  [account: string]: AccountBalances;
}

interface AccountBalances {
  products: Product[];
  meta: Meta[];
}

export interface Meta {
  label: MetaLabel;
  value: number;
  type: string;
  hide?: boolean;
}

interface Product {
  label: string;
  assets?: Asset[];
  meta: Meta[];
}

interface Asset {
  type: string;
  address: string;
  symbol?: string;
  label?: string;
  decimals?: number;
  img?: string;
  price?: number;
  appId: string;
  protocolDisplay: string;
  liquidity?: number;
  supply?: number;
  borrowApy?: number;
  supplyApy?: number;
  tokens: Token[];
  balance?: number;
  balanceRaw?: string;
  balanceUSD: number;
  category?: string;
  apy?: number;
  enabledAsCollateral?: boolean;
  liquidationThreshold?: number;
}

export interface Token {
  type: string;
  symbol: string;
  address: string;
  price: number;
  decimals: number;
  reserve?: number;
  balance: number;
  balanceRaw: string;
  balanceUSD: number;
  metaType?: string;
  label?: string;
  img?: string;
  category?: string;
}

export type MetaLabel = string | 'Assets' | 'Debt' | 'Total';
