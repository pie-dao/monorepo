import { SupportedChains } from '../../utils/networks';

type BigNumberString = string;
export type ChainValue = [SupportedChains, BigNumberString];

type Product = {
  balances: ChainValue[];
  decimals: number;
};

export type Products = {
  [currencySymbol: string]: Product;
};

export type RootState = {
  products: Products;
  loading: boolean;
};
