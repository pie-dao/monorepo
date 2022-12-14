export type TokenConfig = {
  name: string;
  image: string;
  description: string;
  addresses: {
    [chainString: string]: {
      address?: string;
      stakingAddress?: string;
      exclude?: boolean;
    };
  };
  coingeckoId: string;
  investmentFocusImage?: string;
};

export type TokensConfig = {
  [tokenSymbol: string]: TokenConfig;
};
