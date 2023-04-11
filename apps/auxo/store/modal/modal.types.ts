import { BigNumberReference } from '../products/products.types';

export const STEPS = {
  APPROVE_TOKEN: 'APPROVE_TOKEN',
  CONFIRM_STAKE_ARV: 'CONFIRM_STAKE_ARV',
  WITHDRAW_ARV: 'WITHDRAW_ARV',
  EARLY_TERMINATION: 'EARLY_TERMINATION',
  CONFIRM_EARLY_TERMINATION: 'CONFIRM_EARLY_TERMINATION',
  EARLY_TERMINATION_COMPLETED: 'EARLY_TERMINATION_COMPLETED',
  CONFIRM_WITHDRAW_ARV: 'CONFIRM_WITHDRAW_ARV',
  WITHDRAW_ARV_COMPLETED: 'WITHDRAW_ARV_COMPLETED',
  CONFIRM_CONVERT_PRV: 'CONFIRM_CONVERT_PRV',
  CONFIRM_STAKE_PRV: 'CONFIRM_STAKE_PRV',
  CONFIRM_UNSTAKE_PRV: 'CONFIRM_UNSTAKE_PRV',
  STAKE_COMPLETED: 'STAKE_COMPLETED',
  UNSTAKE_COMPLETED: 'UNSTAKE_COMPLETED',
  BOOST_STAKE_ARV: 'BOOST_STAKE_ARV',
  CONVERT_COMPLETED: 'CONVERT_COMPLETED',
} as const;

export type Steps =
  | `${'UNSTAKE_'}${string}`
  | `${'CONFIRM_STAKE_'}${string}`
  | `${'CONFIRM_UNSTAKE_'}${string}`
  | `${'CONFIRM_CONVERT_'}${string}`
  | `${'CONFIRM_WITHDRAW_'}${string}`
  | `${'WITHDRAW_'}${string}`
  | `${'WITHDRAW_ARV_COMPLETED'}`
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
  isConvertAndStake?: boolean;
};
