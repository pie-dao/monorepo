import { BigNumberReference } from '../products/products.types';
import { MerkleDistributorAbi } from '@shared/util-blockchain';

export const STEPS = {
  LIST_REWARDS: 'LIST_REWARDS',
  CLAIM_REWARDS: 'CLAIM_REWARDS',
  COMPOUND_REWARDS: 'COMPOUND_REWARDS',
  CLAIM_MULTI_REWARDS: 'CLAIM_MULTI_REWARDS',
  CLAIM_ALL_REWARDS: 'CLAIM_ALL_REWARDS',
  CLAIM_COMPLETED: 'CLAIM_COMPLETED',
  COMPOUND_COMPLETED: 'COMPOUND_COMPLETED',
  CLAIM_DISSOLUTION: 'CLAIM_DISSOLUTION',
  CLAIM_DISSOLUTION_COMPLETED: 'CLAIM_DISSOLUTION_COMPLETED',
} as const;

export type Steps = keyof typeof STEPS;

export type SliceState = {
  data: Data;
  claimFlow: ClaimFlow;
  dissolution: Month[];
  loading: boolean;
};

export type TokenName = 'ARV' | 'PRV' | 'AUXO';

export type TokenStats = {
  [key in TokenName]: {
    month: string;
    monthAvailable: boolean;
    rewards: BigNumberReference;
  }[];
};

export type Month = {
  monthClaimed: boolean;
  rewards: BigNumberReference;
  proof: string[];
  month: string;
  windowIndex: number;
  accountIndex: number;
};

export type Data = {
  rewardPositions: {
    ARV: Month[];
    PRV: Month[];
  };
  metadata: {
    ARV: {
      total: BigNumberReference;
      isCompound: boolean;
    };
    PRV: {
      total: BigNumberReference;
      isCompound: boolean;
    };
    total: BigNumberReference;
    allTimeTotal: BigNumberReference;
  };
};

export const TX_STATES = {
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
} as const;

export type TxState = keyof typeof TX_STATES;

export type ClaimFlow = {
  phase: number;
  step: Steps;
  token: {
    name: TokenName;
    singleClaim: boolean;
  };
  open: boolean;
  tx: {
    hash?: string;
    status?: TxState;
  };
  claim?: Month;
  showCompleteModal: boolean;
  totalClaiming: BigNumberReference;
};
