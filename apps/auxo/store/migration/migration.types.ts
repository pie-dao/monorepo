import { BigNumberReference } from '../products/products.types';

export enum STEPS_LIST {
  CHOOSE_MIGRATION_TYPE = 1,
  MIGRATE_SELECT_WALLET,
  MIGRATE_CONFIRM,
  MIGRATE_SUCCESS,
}

export const MIGRATION_TYPE = {
  AGGREGATE_AND_BOOST: 'aggregateAndBoost',
  AGGREGATE: 'aggregate',
  SINGLE_LOCK: 'singleLock',
} as const;

export const TX_STATES = {
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
} as const;

export type Position = {
  amount: BigNumberReference;
  lockDuration: number;
  lockedAt: number;
};

export type SliceState = {
  isMigrationDeployed: boolean | null;
  currentStep: STEPS_LIST | null;
  previousStep: STEPS_LIST | null;
  isSingleLock: boolean;
  destinationWallet: string | null;
  loadingPositions: boolean;
  loadingPreview: boolean;
  positions: Position[];
  boost: boolean;
  migrationType: typeof MIGRATION_TYPE[keyof typeof MIGRATION_TYPE] | null;
  DOUGHInput: string;
  estimatedOutput: {
    veAUXO: {
      aggregateAndBoost: BigNumberReference;
      aggregate: BigNumberReference;
      singleLock: BigNumberReference;
    };
    xAUXO: {
      aggregate: BigNumberReference;
      singleLock: BigNumberReference;
    };
  };
  tx: {
    hash: string | null;
    status: string | null;
  };
};
