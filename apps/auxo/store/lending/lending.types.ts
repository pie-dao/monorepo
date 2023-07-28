import { BigNumber } from 'ethers';
import { BigNumberReference } from '../products/products.types';
import { TxState } from '../modal/modal.types';
import { PREFERENCES } from '../../utils/constants';

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
  CHANGE_PREFERENCE: 'CHANGE_PREFERENCE',
  CHANGE_PREFERENCE_COMPLETED: 'CHANGE_PREFERENCE_COMPLETED',
} as const;

export type Steps =
  | `${'LEND'}${string}`
  | `${'APPROVE'}${string}`
  | `${'UNLEND'}${string}`
  | `${'WITHDRAW'}${string}`
  | `${'CHANGE_PREFERENCE'}${string}`;

export type Preferences = (typeof PREFERENCES)[keyof typeof PREFERENCES];

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
  preference?: Preferences;
};

export type Principal = {
  address: string;
  decimals: number;
};

export const STATES = {
  PENDING: 0,
  ACTIVE: 1,
  LOCKED: 2,
  CLOSED: 3,
} as const;

export type States = (typeof STATES)[keyof typeof STATES];

export type Pool = {
  address?: string;
  principal?: string;
  interest?: BigNumberReference;
  lastEpoch?: {
    rate?: BigNumberReference;
    state?: States;
    depositLimit?: BigNumberReference;
    totalBorrow?: BigNumberReference;
    available?: BigNumberReference;
    forClaims?: BigNumberReference;
    forWithdrawal?: BigNumberReference;
  };
  lastActiveEpoch?: {
    rate?: BigNumberReference;
    state?: States;
    depositLimit?: BigNumberReference;
    totalBorrow?: BigNumberReference;
    available?: BigNumberReference;
    forClaims?: BigNumberReference;
    forWithdrawal?: BigNumberReference;
  };
  userData?: {
    balance?: BigNumberReference;
    yield?: BigNumberReference;
    canWithdraw?: boolean;
    canClaim?: boolean;
    canCompound?: boolean;
    unlendableAmount?: BigNumberReference;
    preference?: number;
    allowance?: BigNumberReference;
  };
  canDeposit?: boolean;
  epochCapacity?: BigNumberReference;
  epochs?: convertedEpoch[];
};

export type Pools = {
  [x: string]: Pool;
};

export type userPositions = [Pools, BigNumberReference, BigNumberReference];

export type Epoch = {
  rate: BigNumber;
  state: number;
  depositLimit: BigNumber;
  totalBorrowed: BigNumber;
  available: BigNumber;
  forClaims: BigNumber;
  forWithdrawal: BigNumber;
};

export type convertedEpoch = {
  rate: BigNumberReference;
  state: States;
  depositLimit: BigNumberReference;
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
