import { ChainMap, SUPPORTED_CHAINS } from '../../utils/networks';

/**
 * Initialise a vault with basic information
 */
interface BasicVaultInformation {
  name: string;
  address: string;
  description: string;
  strategies: Strategy[];
  network: {
    name: keyof typeof SUPPORTED_CHAINS;
    chainId: keyof ChainMap;
    multicall: string | null;
  };
  symbol: string;
}

export type ExternalURL = {
  name: string;
  to: string;
};

// information about an individual strategy
export type Strategy = {
  name: string;
  allocation: number;
  description: string;
  links: ExternalURL[];
};

// store the raw value of any balances as a string but provide a human readable number
export type Balance = {
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
  currentAPY: Balance;
  deposits: Balance;
  lastHarvest: number;
  batchBurnRound: number;
  exchangeRate: Balance;
}

// Properties unique to a given user ie. own deposits
export interface UserBalances {
  wallet: Balance;
  vaultUnderlying: Balance;
  vault: Balance;
  allowance: Balance;
  batchBurn: {
    round: number;
    shares: Balance;
    available: Balance;
  };
}

// information about the vault auth contract, used for checking if an account is allowed to use this vault
export interface VaultAuth {
  address: string;
  isDepositor: boolean;
}

// information about the per-account deposit limits (note, the vaultcap contract extends the vault base)
export interface VaultCap {
  underlying: Balance | null;
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

export interface VaultState {
  vaults: Vault[];
  selected: null | string;
  isLoading: boolean;
}

export type VaultSpecifics = Omit<Vault, 'network'>;
export type VaultOnChainData = Pick<Vault, 'address' | 'stats' | 'token'>;
export type UserBalanceOnChainData = Pick<Vault, 'address' | 'userBalances'>;
