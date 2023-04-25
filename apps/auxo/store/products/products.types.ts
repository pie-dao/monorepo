import { SupportedChains } from '../../utils/networks';

export type ChainValue = Record<SupportedChains, BigNumberReference>;
export type ChainBasedInfo = Record<SupportedChains, ChainInfo>;

export type ChainInfo = {
  address: string;
  balance?: BigNumberReference;
  allowance?: BigNumberReference;
};

export type Token = {
  productDecimals?: number;
  totalBalance?: BigNumberReference;
  chainInfo?: ChainBasedInfo;
  stakingAmount?: BigNumberReference;
  totalSupply?: BigNumberReference;
  stakingToken?: string;
  votingAddresses?: number;
  fee?: BigNumberReference;
  earlyTerminationFee?: BigNumberReference;
  currentWithdrawalAmount?: BigNumberReference;
  userStakingData?: {
    amount?: BigNumberReference;
    currentEpochBalance?: BigNumberReference;
    pendingBalance?: BigNumberReference;
    lockedAt?: number;
    lockDuration?: number;
    votingPower?: BigNumberReference;
    delegator?: string;
    claimableAmount?: BigNumberReference;
  };
};

export type Tokens = {
  [x: string]: Token;
};

export type BigNumberReference = {
  label: number;
  value: string;
};

export type Stats = {
  networks: {
    tokens: number;
    total: number;
  };
  assets: {
    tokensUsed: number;
    totalProductsUsed: number;
  };
  balance: {
    tokens: number;
    total: number;
  };
};

export type SliceState = {
  tokens: Tokens;
  stats: Stats;
  loading: boolean;
  increasedStakingValue: number;
};
