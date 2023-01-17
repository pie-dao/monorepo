import { BigNumberReference } from '../products/products.types';

export const STEPS = {
  APPROVE_TOKEN: 'APPROVE_TOKEN',
  CONFIRM_STAKE_VEAUXO: 'CONFIRM_STAKE_VEAUXO',
  CONFIRM_CONVERT_XAUXO: 'CONFIRM_CONVERT_XAUXO',
  CONFIRM_STAKE_XAUXO: 'CONFIRM_STAKE_XAUXO',
  CONFIRM_UNSTAKE_XAUXO: 'CONFIRM_UNSTAKE_XAUXO',
  STAKE_COMPLETED: 'STAKE_COMPLETED',
  BOOST_STAKE_VEAUXO: 'BOOST_STAKE_VEAUXO',
} as const;

export type Steps =
  | `${'CONFIRM_STAKE_'}${string}`
  | `${'CONFIRM_UNSTAKE_'}${string}`
  | `${'CONFIRM_CONVERT_'}${string}`
  | `${'STAKE_COMPLETED'}`
  | `${'APPROVE_TOKEN'}`
  | `${'BOOST_STAKE_'}${string}`;

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
  };
};
