import { createAsyncThunk } from '@reduxjs/toolkit';
import { promiseObject } from '../../utils/promiseObject';
import {
  veDOUGHSharesTimeLock,
  Upgradoor,
} from '../../store/products/products.contracts';
import { toBalance } from '../../utils/formatBalance';
import { UpgradoorAbi } from '@shared/util-blockchain';
import { pendingNotification } from '../../components/Notifications/Notifications';
import { ContractTransaction } from 'ethers';
import { setCurrentStep, setTx, setTxState } from './migration.slice';
import { STEPS_LIST, TX_STATES } from './migration.types';

export const THUNKS = {
  GET_VEDOUGH_STAKING_DATA: 'migration/getVeDOUGHStakingData',
  MIGRATE_VEDOUGH: 'migration/migrateVeDOUGH',
  GET_MIGRATION_PREVIEW: 'migration/getMigrationPreview',
};

export const ThunkGetVeDOUGHStakingData = createAsyncThunk(
  THUNKS.GET_VEDOUGH_STAKING_DATA,
  async ({ account }: { account: string }) => {
    if (!account) return;
    const numberOfLocks = promiseObject({
      locksLength: veDOUGHSharesTimeLock.getLocksOfLength(account),
      latestLock: Upgradoor.getNextLongestLock(account),
    });

    const { locksLength, latestLock } = await numberOfLocks;

    const locks = await Promise.all(
      Array.from(Array(locksLength.toNumber())).map((_, i) => {
        return veDOUGHSharesTimeLock.locksOf(account, i);
      }),
    );

    const locksFormatted = locks.map((lock) => {
      const [amount, lockedAt, lockDuration] = lock;
      return {
        amount,
        lockDuration,
        lockedAt,
      };
    });

    const latestLockFormatted = {
      amount: toBalance(latestLock[0], 18),
      lockDuration: latestLock[2],
      lockedAt: latestLock[1],
    };

    return [latestLockFormatted].concat(
      locksFormatted
        .filter((lock) => lock.lockedAt !== latestLock[1])
        .sort((a, b) => {
          if (a.lockDuration === b.lockDuration) return 1;
          return b.lockDuration - a.lockDuration;
        })
        .map((lock) => {
          const { amount, lockDuration, lockedAt } = lock;
          return {
            amount: toBalance(amount, 18),
            lockDuration,
            lockedAt,
          };
        }),
    );
  },
);

export type ThunkMigrateVeDOUGHProps = {
  upgradoor: UpgradoorAbi;
  boost: boolean;
  destinationWallet: string;
  token: 'ARV' | 'PRV';
  isSingleLock: boolean;
  sender: string;
};

export const ThunkMigrateVeDOUGH = createAsyncThunk(
  THUNKS.MIGRATE_VEDOUGH,
  async (
    {
      upgradoor,
      boost,
      destinationWallet,
      token,
      isSingleLock,
      sender,
    }: ThunkMigrateVeDOUGHProps,
    { rejectWithValue, dispatch },
  ) => {
    if (
      !upgradoor ||
      typeof boost !== 'boolean' ||
      !destinationWallet ||
      !token ||
      typeof isSingleLock !== 'boolean'
    ) {
      return rejectWithValue(
        'Missing Contract, Boost, Destination Wallet, Token to migrate to or single lock definition',
      );
    }

    dispatch(
      setTx({
        hash: null,
        status: null,
      }),
    );

    const {
      aggregateAndBoost,
      aggregateToARV,
      upgradeSingleLockARV,
      aggregateToPRV,
      upgradeSingleLockPRV,
    } = upgradoor;

    let tx: ContractTransaction;
    try {
      if (token === 'ARV') {
        if (isSingleLock) {
          tx = await upgradeSingleLockARV(destinationWallet);
          pendingNotification({
            title: `updateSingleLockARVPending`,
            id: 'updateSingleLockARV',
          });
        } else if (boost) {
          tx = await aggregateAndBoost();
          pendingNotification({
            title: `aggregateAndBoostVeDOUGHPending`,
            id: 'aggregateVeDOUGH',
          });
        } else {
          tx = await aggregateToARV();
          pendingNotification({
            title: `aggregateVeDOUGHPending`,
            id: 'aggregateVeDOUGH',
          });
        }
      } else {
        if (isSingleLock) {
          tx = await upgradeSingleLockPRV(destinationWallet);
          pendingNotification({
            title: `aggregateVeDOUGHPending`,
            id: 'aggregateVeDOUGH',
          });
        } else {
          tx = await aggregateToPRV();
          pendingNotification({
            title: `aggregateVeDOUGHPending`,
            id: 'aggregateVeDOUGH',
          });
        }
      }
    } catch (e) {
      return rejectWithValue(e.message);
    }

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      setTxState(TX_STATES.COMPLETE);
      dispatch(setCurrentStep(STEPS_LIST.MIGRATE_SUCCESS));
      dispatch(ThunkGetVeDOUGHStakingData({ account: sender }));
    }

    if (receipt.status !== 1) {
      setTxState(TX_STATES.FAILED);
      return rejectWithValue('Migration Failed');
    }
  },
);

type ThunkPreviewMigrationProps = {
  boost: boolean;
  token: 'ARV' | 'PRV';
  isSingleLock: boolean;
  sender: string;
  destinationWallet: string;
};

export const ThunkPreviewMigration = createAsyncThunk(
  THUNKS.GET_MIGRATION_PREVIEW,
  async (
    {
      boost,
      token,
      isSingleLock,
      sender,
      destinationWallet,
    }: ThunkPreviewMigrationProps,
    { rejectWithValue },
  ) => {
    if (
      typeof boost !== 'boolean' ||
      !token ||
      typeof isSingleLock !== 'boolean' ||
      !sender ||
      !destinationWallet
    ) {
      return rejectWithValue(
        'Missing Contract, Boost, Destination Wallet, Token to migrate to or single lock definition',
      );
    }

    const previews = promiseObject({
      veAUXOAggregateAndBoost: Upgradoor.previewAggregateAndBoost(sender),
      veAUXOAggregate: Upgradoor.previewAggregateARV(sender),
      veAUXOSingleLock: Upgradoor.previewUpgradeSingleLockARV(
        sender,
        destinationWallet,
      ),
      xAUXOAggregate: Upgradoor.previewAggregateToPRV(sender),
      xAUXOSingleLock: Upgradoor.previewUpgradeSingleLockPRV(sender),
    });

    const {
      veAUXOAggregateAndBoost,
      veAUXOAggregate,
      veAUXOSingleLock,
      xAUXOAggregate,
      xAUXOSingleLock,
    } = await previews;

    return {
      ARV: {
        aggregateAndBoost: toBalance(veAUXOAggregateAndBoost, 18),
        aggregate: toBalance(veAUXOAggregate, 18),
        singleLock: toBalance(veAUXOSingleLock, 18),
      },
      PRV: {
        aggregate: toBalance(xAUXOAggregate, 18),
        singleLock: toBalance(xAUXOSingleLock, 18),
      },
    };
  },
);
