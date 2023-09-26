export type TokenConfig = {
  name: string;
  image: string;
  description: string;
  addresses: {
    [chainString: string]: {
      address?: string;
      stakingAddress?: string;
      rollStakerAddress?: string;
      merkleDistributorAddress?: string;
      PRVMerkleVerifierAddress?: string;
      PRVRouterAddress?: string;
      exclude?: boolean;
    };
  };
  coingeckoId: string;
  investmentFocusImage?: string;
  decimals?: number;
};

export type TokensConfig = {
  [tokenSymbol: string]: TokenConfig;
};
