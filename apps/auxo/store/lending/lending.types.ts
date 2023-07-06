import { BigNumber } from 'ethers';
import { BigNumberReference } from '../products/products.types';
import { TxState } from '../modal/modal.types';

export type SliceState = {
  pools: Pools;
  loading: boolean;
  totalDeposited?: number;
  userTotalDeposited?: number;
  userTotalClaimable?: number;
  lendingFlow: LendingFlow;
};

export const STEPS = {
  LEND_DEPOSIT: 'LEND_DEPOSIT',
  APPROVE_LEND: 'APPROVE_LEND',
  LEND_DEPOSIT_COMPLETED: 'LEND_DEPOSIT_COMPLETED',
  LEND_REWARDS_CLAIM: 'LEND_REWARDS_CLAIM',
  LEND_REWARDS_CLAIM_COMPLETED: 'LEND_REWARDS_CLAIM_COMPLETED',
  UNLEND: 'UNLEND',
  UNLEND_COMPLETED: 'UNLEND_COMPLETED',
  WITHDRAW_REQUEST: 'WITHDRAW_REQUEST',
  WITHDRAW_CONFIRM_COMPLETED: 'WITHDRAW_CONFIRM_COMPLETED',
  WITHDRAW_CONFIRM: 'WITHDRAW_CONFIRM',
  WITHDRAW_REQUEST_COMPLETED: 'WITHDRAW_REQUEST_COMPLETED',
} as const;

export type Steps = keyof typeof STEPS;

export type LendingFlow = {
  step: Steps;
  principal: string;
  amount: BigNumberReference;
  open: boolean;
  tx: {
    hash?: string;
    status?: TxState;
  };
  showCompleteModal: boolean;
  spender?: string;
  selectedPool?: string;
  preference?: number;
};

export type Principal = {
  address: string;
  decimals: number;
};

export type Pool = {
  address?: string;
  principal?: string;
  interest?: BigNumberReference;
  lastEpoch?: {
    rate?: BigNumberReference;
    state?: number;
    maxBorrow?: BigNumberReference;
    totalBorrow?: BigNumberReference;
    available?: BigNumberReference;
    forClaims?: BigNumberReference;
    forWithdrawal?: BigNumberReference;
  };
  lastActiveEpoch?: {
    rate?: BigNumberReference;
    state?: number;
    maxBorrow?: BigNumberReference;
    totalBorrow?: BigNumberReference;
    available?: BigNumberReference;
    forClaims?: BigNumberReference;
    forWithdrawal?: BigNumberReference;
  };
  isLocked?: boolean;
  userData?: {
    balance?: BigNumberReference;
    yield?: BigNumberReference;
    canWithdraw?: boolean;
    unlendableAmount?: BigNumberReference;
    preference?: number;
    allowance?: BigNumberReference;
  };
  epochs?: convertedEpoch[];
};

export type Pools = {
  [x: string]: Pool;
};

export type userPositions = [Pools, BigNumberReference, BigNumberReference];

export type Epoch = {
  rate: BigNumber;
  state: number;
  maxBorrow: BigNumber;
  totalBorrowed: BigNumber;
  available: BigNumber;
  forClaims: BigNumber;
  forWithdrawal: BigNumber;
};

export type convertedEpoch = {
  rate: BigNumberReference;
  state: number;
  maxBorrow: BigNumberReference;
  totalBorrow: BigNumberReference;
  available: BigNumberReference;
  forClaims: BigNumberReference;
  forWithdrawal: BigNumberReference;
};

export const TX_STATES = {
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
} as const;
