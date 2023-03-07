import { BigNumberReference } from '../products/products.types';

export const STEPS = {
  APPROVE_TOKEN: 'APPROVE_TOKEN',
  CONFIRM_STAKE_VEAUXO: 'CONFIRM_STAKE_VEAUXO',
  UNSTAKE_VEAUXO: 'UNSTAKE_VEAUXO',
  EARLY_TERMINATION: 'EARLY_TERMINATION',
  CONFIRM_EARLY_TERMINATION: 'CONFIRM_UNSTAKE_VEAUXO',
  EARLY_TERMINATION_COMPLETED: 'EARLY_TERMINATION_COMPLETED',
  CONFIRM_UNSTAKE_VEAUXO: 'CONFIRM_UNSTAKE_VEAUXO',
  UNSTAKE_VEAUXO_COMPLETED: 'UNSTAKE_VEAUXO_COMPLETED',
  CONFIRM_CONVERT_XAUXO: 'CONFIRM_CONVERT_XAUXO',
  CONFIRM_STAKE_XAUXO: 'CONFIRM_STAKE_XAUXO',
  CONFIRM_UNSTAKE_XAUXO: 'CONFIRM_UNSTAKE_XAUXO',
  STAKE_COMPLETED: 'STAKE_COMPLETED',
  UNSTAKE_COMPLETED: 'UNSTAKE_COMPLETED',
  BOOST_STAKE_VEAUXO: 'BOOST_STAKE_VEAUXO',
  CONVERT_COMPLETED: 'CONVERT_COMPLETED',
} as const;

export type Steps =
  | `${'UNSTAKE_'}${string}`
  | `${'CONFIRM_STAKE_'}${string}`
  | `${'CONFIRM_UNSTAKE_'}${string}`
  | `${'CONFIRM_CONVERT_'}${string}`
  | `${'UNSTAKE_VEAUXO_COMPLETED'}`
  | `${'UNSTAKE_COMPLETED'}`
  | `${'STAKE_COMPLETED'}`
  | `${'APPROVE_TOKEN'}`
  | `${'CONVERT_COMPLETED'}`
  | `${'BOOST_STAKE_'}${string}`
  | `${'EARLY_TERMINATION'}`
  | `${'CONFIRM_EARLY_TERMINATION'}`
  | `${'EARLY_TERMINATION_COMPLETED'}`;

export const TX_STATES = {
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
} as const;

export type TxState = keyof typeof TX_STATES;

export type SliceState = {
  step?: Steps;
  isOpen: boolean;
  tx?: {
    hash?: string;
    status?: TxState;
  };
  swap?: {
    from: {
      amount: BigNumberReference;
      token: string;
    };
    to: {
      amount: BigNumberReference;
      token: string;
    };
    spender?: string;
    stakingTime?: number;
    losingAmount?: BigNumberReference;
  };
  showCompleteModal?: boolean;
};
