import { createAsyncThunk } from '@reduxjs/toolkit';
import { promiseObject } from '../../utils/promiseObject';
import { veDOUGHSharesTimeLock } from '../../store/products/products.contracts';
import { toBalance } from '../../utils/formatBalance';

export const THUNKS = {
  GET_VEDOUGH_STAKING_DATA: 'migration/getVeDOUGHStakingData',
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
      Array.from(Array(locksLength.toNumber())).map((_, i) =>
        veDOUGHSharesTimeLock.locksOf(account, i),
      ),
    );

    return locks
      .sort((a, b) => b.lockDuration - a.lockDuration)
      .map((lock) => {
        const { amount, lockDuration, lockedAt } = lock;
        return {
          amount: toBalance(amount, 18),
          lockDuration,
          lockedAt,
        };
      });
  },
);
