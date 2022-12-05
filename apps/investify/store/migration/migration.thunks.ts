import { createAsyncThunk } from '@reduxjs/toolkit';
import { promiseObject } from '../../utils/promiseObject';
import { veDOUGHSharesTimeLock } from '../../store/products/products.contracts';
import { toBalance } from '../../utils/formatBalance';
import { UpgradoorAbi } from '@shared/util-blockchain';
import { pendingNotification } from '../../components/Notifications/Notifications';
import { BigNumber, ContractTransaction } from 'ethers';
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
    });

    const { locksLength } = await numberOfLocks;

    const locks = await Promise.all(
      Array.from(Array(locksLength.toNumber())).map((_, i) => {
        console.log(i);
        return veDOUGHSharesTimeLock.locksOf(account, i);
      }),
    );

    console.log(locks);

    return locks
      .sort((a, b) => {
        if (a.lockDuration === b.lockDuration) return -1;
        return b.lockDuration - a.lockDuration;
      })
      .map((lock) => {
        const { amount, lockDuration, lockedAt } = lock;
        console.log(lockDuration);
        console.log('------');
        console.log(lockedAt);
        return {
          amount: toBalance(amount, 18),
          lockDuration,
          lockedAt,
        };
      });
  },
);

export type ThunkMigrateVeDOUGHProps = {
  upgradoor: UpgradoorAbi;
  boost: boolean;
  destinationWallet: string;
  token: 'veAUXO' | 'xAUXO';
  isSingleLock: boolean;
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

    let tx: ContractTransaction;

    switch (token) {
      case 'veAUXO':
        if (!isSingleLock) {
          if (boost) {
            tx = await upgradoor.aggregateAndBoost();
            pendingNotification({
              title: `aggregateAndBoostVeDOUGHPending`,
              id: 'aggregateAndBoostVeDOUGH',
            });
            return tx.wait();
          } else {
            tx = await upgradoor.aggregateToVeAuxo();
            pendingNotification({
              title: `aggregateVeDOUGHPending`,
              id: 'aggregateVeDOUGH',
            });
          }
        } else {
          tx = await upgradoor.upgradeSingleLockVeAuxo(destinationWallet);
        }
        break;
      case 'xAUXO':
        if (!isSingleLock) {
          tx = await upgradoor.aggregateToXAuxo();
          pendingNotification({
            title: `aggregateveDOUGHPending`,
            id: 'aggregateveDOUGH',
          });
        } else {
          tx = await upgradoor.upgradeSingleLockXAuxo(destinationWallet);
          pendingNotification({
            title: `aggregateVeDOUGHPending`,
            id: 'aggregateVeDOUGH',
          });
        }
        break;
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
    }

    if (receipt.status !== 1) {
      setTxState(TX_STATES.FAILED);
      return rejectWithValue('Migration Failed');
    }
  },
);

export const ThunkPreviewMigration = createAsyncThunk(
  THUNKS.GET_MIGRATION_PREVIEW,
  async (
    {
      upgradoor,
      boost,
      destinationWallet,
      token,
      isSingleLock,
      sender,
    }: ThunkMigrateVeDOUGHProps & { sender: string },
    { rejectWithValue },
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

    let preview: BigNumber;

    switch (token) {
      case 'veAUXO':
        if (!isSingleLock) {
          if (boost) {
            preview = await upgradoor.previewAggregateAndBoost(
              destinationWallet,
            );
          } else {
            preview = await upgradoor.previewAggregateVeAUXO(destinationWallet);
          }
        } else {
          preview = await upgradoor.previewUpgradeSingleLockVeAuxo(
            sender,
            destinationWallet,
          );
        }

        break;
      case 'xAUXO':
        if (!isSingleLock) {
          preview = await upgradoor.previewAggregateToXAUXO(sender);
        } else {
          preview = await upgradoor.previewUpgradeSingleLockXAUXO(sender);
        }
        break;
    }

    return toBalance(preview, 18);
  },
);
