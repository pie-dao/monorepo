import { SupportedChains } from '../../utils/networks';

export type ChainValue = Record<SupportedChains, BigNumberReference>;
export type ChainBasedInfo = Record<SupportedChains, ChainInfo>;

export type ChainInfo = {
  address: string;
  balance?: BigNumberReference;
  allowance?: BigNumberReference;
};

export type Token = {
  productDecimals: number;
  totalBalance?: BigNumberReference;
  chainInfo?: ChainBasedInfo;
  stakingAmount?: BigNumberReference;
  totalSupply?: BigNumberReference;
  stakingToken?: string;
  fee?: BigNumberReference;
  userStakingData?: {
    amount: BigNumberReference;
    lockedAt: number;
    lockDuration: number;
  };
};

export type Tokens = {
  [x: string | number]: Token;
};

interface BasicVaultInformation {
  name: string;
  address: string;
  description: string;
  symbol: string;
  chainId: number;
  underlyingSymbol: string;
}

export type Vaults = {
  [vaultSymbol: string]: Vault;
};

export type BigNumberReference = {
  label: number;
  value: string;
};

// Information about the underlying vault token
export interface VaultToken {
  address: string;
  decimals: number;
}

// Properties shared across users, ie. total deposits
export interface VaultStats {
  currentAPY: BigNumberReference;
  deposits: BigNumberReference;
  lastHarvest: number;
  batchBurnRound: number;
  exchangeRate: BigNumberReference;
}

// Properties unique to a given user ie. own deposits
export interface UserBalances {
  wallet: BigNumberReference;
  vaultUnderlying: BigNumberReference;
  vault: BigNumberReference;
  allowance: BigNumberReference;
  batchBurn: {
    round: number;
    shares: BigNumberReference;
    available: BigNumberReference;
  };
}

// information about the vault auth contract, used for checking if an account is allowed to use this vault
export interface VaultAuth {
  address: string;
  isDepositor: boolean;
}

// information about the per-account deposit limits (note, the vaultcap contract extends the vault base)
export interface VaultCap {
  underlying: BigNumberReference | null;
}

/**
 * Additional Vault fields are populated at runtime, thus they may be optional
 */
export interface Vault extends BasicVaultInformation {
  token: VaultToken;
  auth: VaultAuth;
  cap: VaultCap;
  stats?: VaultStats;
  userBalances?: UserBalances;
}

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
  tokens: Tokens;
  vaults: Vaults;
  stats: Stats;
  loading: boolean;
  activeVault: string;
  activeToken: string;
};
