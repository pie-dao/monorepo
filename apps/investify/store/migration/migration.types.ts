import { BigNumberReference } from '../products/products.types';

export enum STEPS_LIST {
  CHOOSE_MIGRATION_TYPE_VE_AUXO = 1,
  AGGREGATE_ALL_LOCKS_VE_AUXO,
  AGGREGATE_ALL_LOCKS_VE_AUXO_CONFIRM,
}

export type Position = {
  amount: BigNumberReference;
  lockDuration: number;
  lockedAt: number;
};

export type SliceState = {
  isFirstTimeMigration: boolean;
  currentStep: STEPS_LIST.CHOOSE_MIGRATION_TYPE_VE_AUXO | null;
  previousStep: STEPS_LIST | null;
  migrateTo: 'xAUXO' | 'veAUXO' | null;
  destinationWallet: string | null;
  loadingPositions: boolean;
  positions: Position[];
};
