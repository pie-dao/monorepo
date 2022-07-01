import { SupportedChains } from '../../utils/networks';

export type BigNumberString = string;
export type ChainValue = Record<SupportedChains, BigNumberString>;

type Product = {
  balances: ChainValue;
  productDecimals: number;
  totalBalance: BigNumberString;
};

export type Products = {
  [currencySymbol: string]: Product;
};

export type Vaults = {
  [vaultSymbol: string]: Vault;
};

export type Vault = {
  totalUnderlying: string;
  lastHarvest: string;
  estimatedReturn: string;
  batchBurnRound: string;
  userDepositLimit: string;
  exchangeRate: string;
  balance: string;
  decimals: number;
  symbol: string;
  name: string;
  totalDeposited: number;
  chainId: number;
  address: string;
};

export type Stats = {
  networks: {
    vaults: number;
    tokens: number;
    total: number;
  };
  assets: {
    vaultsUsed: number;
    tokensUsed: number;
    totalProductsUsed: number;
  };
  balance: {
    tokens: number;
    vaults: number;
    total: number;
  };
};

export type SliceState = {
  tokens: Products;
  vaults: Vaults;
  stats: Stats;
  loading: boolean;
};

export type EnrichedProduct = {
  [x: string]: {
    balances: ChainValue;
    productDecimals: number;
    totalBalance: string;
  };
};
