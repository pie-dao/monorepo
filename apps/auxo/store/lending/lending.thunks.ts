import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  contractWrappers,
  poolAddressesContracts,
} from '../products/products.contracts';
import { promiseObject } from '../../utils/promiseObject';
import { find, isEmpty } from 'lodash';
import { EIP1193Provider } from '@web3-onboard/core';
import { toBalance } from '../../utils/formatBalance';
import { BigNumber, ContractTransaction } from 'ethers';
import { Epoch, STEPS, States, Steps, TX_STATES } from './lending.types';
import { calculatePriceInUSD, zeroBalance } from '../../utils/balances';
import { findProductByAddress } from '../../utils/findProductByAddress';
import { fetchPrice } from '../../hooks/useCoingecko';
import { BigNumberReference } from '../products/products.types';
import { Erc20Abi, LendingPoolAbi } from '@shared/util-blockchain';
import { pendingNotification } from '../../components/Notifications/Notifications';
import {
  setLendingStep,
  setPreference,
  setTx,
  setTxHash,
} from './lending.slice';
import { PREFERENCES } from '../../utils/constants';

const createEpochObject = (epoch: Epoch, decimals: number) => ({
  rate: toBalance(epoch.rate.mul(BigNumber.from(100)), 18),
  state: epoch.state as States,
  depositLimit: toBalance(epoch.depositLimit, decimals),
  totalBorrow: toBalance(epoch.totalBorrowed, decimals),
  available: toBalance(epoch.available, decimals),
  forClaims: toBalance(epoch.forClaims, decimals),
  forWithdrawal: toBalance(epoch.forWithdrawal, decimals),
});

export const THUNKS = {
  GET_LENDING_DATA: 'app/getLendingData',
  GET_USER_LENDING_DATA: 'app/getUserLendingData',
  APPROVE_LENDING_TOKEN: 'app/approveLendingToken',
  LEND_DEPOSIT: 'app/lendDeposit',
  LEND_WITH_SIGNATURE: 'app/lendWithSignature',
  CHANGE_PREFERENCE: 'app/changePreference',
  CLAIM_REWARDS: 'app/claimRewards',
  UNLOAN: 'app/unloan',
  REQUEST_WITHDRAWAL: 'app/requestWithdrawal',
  WITHDRAW: 'app/withdraw',
  COMPOUND_YIELD: 'app/compoundYield',
};

export const thunkGetLendingData = createAsyncThunk(
  THUNKS.GET_LENDING_DATA,
  async (_, { rejectWithValue }) => {
    try {
      const lendingPoolsDataResults = await Promise.allSettled(
        poolAddressesContracts.map((wrappedPool) => {
          const results = promiseObject({
            poolAddress: wrappedPool.address,
            principal: wrappedPool.principalToken(),
            lastEpoch: wrappedPool.getLatestEpoch(),
            lastActiveEpoch: wrappedPool.getLastActiveEpoch(),
            epochs: wrappedPool.getEpochs(),
            canDeposit: wrappedPool.isPoolAcceptingDeposits(),
            epochCapacity: wrappedPool.getPendingEpochCapacity(),
          });
          return results;
        }),
      );
      const lendingPoolsData = lendingPoolsDataResults
        .map((result) => {
          if (result.status === 'fulfilled') {
            return result.value;
          }
          if (result.status === 'rejected') {
            rejectWithValue(result.reason);
          }
        })
        .filter(
          (item) => !(Object.keys(item).length === 1 && 'poolAddress' in item),
        );
      let totalDeposited = 0;
      try {
        for (const pool of lendingPoolsData) {
          const decimals = findProductByAddress(pool.principal)?.decimals;
          const price = await fetchPrice(pool.principal, 'usd');
          totalDeposited += calculatePriceInUSD(
            toBalance(pool.lastEpoch.totalBorrowed, decimals),
            decimals,
            price,
          );
        }
      } catch (err) {
        console.error(err);
      }

      return {
        totalDeposited,
        pools: Object.fromEntries(
          lendingPoolsData.map((pool) => {
            const decimals = findProductByAddress(pool.principal).decimals;
            return [
              pool.poolAddress,
              {
                address: pool.poolAddress,
                principal: pool.principal,
                lastEpoch: !isEmpty(pool?.lastEpoch)
                  ? createEpochObject(pool.lastEpoch, decimals)
                  : null,
                lastActiveEpoch: !isEmpty(pool?.lastActiveEpoch)
                  ? createEpochObject(pool?.lastActiveEpoch, decimals)
                  : null,
                epochs: pool.epochs.map((epoch) => {
                  return createEpochObject(epoch, decimals);
                }),
                canDeposit: pool.canDeposit,
                epochCapacity: toBalance(pool.epochCapacity, decimals),
              },
            ];
          }),
        ),
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export type ThunkUserLendingData = {
  account: string;
  provider: EIP1193Provider;
};

export const thunkGetUserLendingData = createAsyncThunk(
  THUNKS.GET_USER_LENDING_DATA,
  async ({ account, provider }: ThunkUserLendingData, { rejectWithValue }) => {
    if (!account || !provider) {
      return rejectWithValue('No account or provider');
    }
    try {
      const lendingPoolsDataResults = await Promise.allSettled(
        poolAddressesContracts.map((wrappedPool) => {
          const results = promiseObject({
            poolAddress: wrappedPool.address,
            principal: wrappedPool.principalToken(),
            claimableRewards: wrappedPool.claimable(account),
            loan: wrappedPool.getLoan(account),
            canWithdraw: wrappedPool.canWithdraw(account),
            canClaim: wrappedPool.canClaim(account),
            unlendableAmount: wrappedPool.getUnlendableAmount(account),
            loanAndCompound: wrappedPool.previewCompound(account),
            canCompound: wrappedPool.canCompound(account),
          });
          return results;
        }),
      );
      const lendingPoolsData = lendingPoolsDataResults
        .map((result) => {
          if (result.status === 'fulfilled') {
            return result.value;
          }
          if (result.status === 'rejected') {
            rejectWithValue(result.reason);
          }
        })
        .filter(
          (item) => !(Object.keys(item).length === 1 && 'poolAddress' in item),
        );

      let totalDeposited = 0;
      let totalClaimableRewards = 0;

      const lendingPoolsApproval = await Promise.allSettled(
        lendingPoolsData.map((pool) => {
          const principalContract = find(
            contractWrappers,
            (contract) =>
              contract.address.toLowerCase() === pool.principal.toLowerCase(),
          );
          return promiseObject({
            allowance: principalContract.multichain.allowance(
              account,
              pool.poolAddress,
            ),
            poolAddress: pool.poolAddress,
          });
        }),
      );

      const lendingPoolsApprovalData = lendingPoolsApproval
        .map((result) => {
          if (result.status === 'fulfilled') {
            const { allowance, poolAddress } = result.value;
            if (allowance.data[1]?.status === 'fulfilled') {
              return {
                allowance: allowance?.data?.[1]?.value,
                poolAddress,
              };
            }
          }
          if (result.status === 'rejected') {
            return null;
          }
        })
        .filter(Boolean);

      try {
        for (const pool of lendingPoolsData) {
          const decimals = findProductByAddress(pool.principal).decimals;
          const price = await fetchPrice(pool.principal, 'usd');
          totalClaimableRewards += calculatePriceInUSD(
            toBalance(pool.claimableRewards, decimals),
            decimals,
            price,
          );
          totalDeposited += calculatePriceInUSD(
            toBalance(pool.loanAndCompound ?? pool.loan.amount, decimals),
            decimals,
            price,
          );
        }
      } catch (err) {
        console.error(err);
      }

      return {
        userTotalDeposited: totalDeposited,
        userTotalClaimable: totalClaimableRewards,
        pools: Object.fromEntries(
          lendingPoolsData.map((pool) => {
            return [
              pool.poolAddress,
              {
                userData: {
                  balance: toBalance(
                    pool.loanAndCompound ?? pool.loan.amount,
                    findProductByAddress(pool.principal).decimals,
                  ),
                  balanceWithoutCompound: toBalance(
                    pool.loan.amount,
                    findProductByAddress(pool.principal).decimals,
                  ),
                  yield: toBalance(
                    pool.claimableRewards,
                    findProductByAddress(pool.principal).decimals,
                  ),
                  canWithdraw: pool?.canWithdraw,
                  canClaim: pool?.canClaim,
                  canCompound: pool?.canCompound,
                  unlendableAmount: pool?.unlendableAmount
                    ? toBalance(
                        pool.unlendableAmount,
                        findProductByAddress(pool.principal).decimals,
                      )
                    : zeroBalance,
                  preference: pool?.loan?.preference,
                  allowance: toBalance(
                    lendingPoolsApprovalData.find(
                      (approval) => approval.poolAddress === pool.poolAddress,
                    )?.allowance,
                    findProductByAddress(pool.principal).decimals,
                  ),
                },
              },
            ];
          }),
        ),
      };
    } catch (err) {
      rejectWithValue(err);
    }
  },
);

export type ThunkApproveTokenProps = {
  deposit: BigNumberReference;
  token: Erc20Abi | undefined;
  spender: string;
  nextStep: Steps;
};

export const thunkApproveToken = createAsyncThunk(
  THUNKS.APPROVE_LENDING_TOKEN,
  async (
    { deposit, token, spender, nextStep }: ThunkApproveTokenProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!token || !spender)
      return rejectWithValue('Missing token or staking contract');
    dispatch(setTxHash(null));
    const tx = await token.approve(spender, deposit.value);

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `approveTokenPending`,
      id: 'approveToken',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setTxHash(null));
      dispatch(setLendingStep(nextStep));
    }

    if (receipt.status !== 1) rejectWithValue('Approval Failed');
  },
);

export type ThunkLendDeposit = {
  deposit: BigNumberReference;
  lendingPool: LendingPoolAbi;
  canClaim: boolean;
  canCompound: boolean;
};

export const thunkLendDeposit = createAsyncThunk(
  THUNKS.LEND_DEPOSIT,
  async (
    { deposit, lendingPool, canClaim, canCompound }: ThunkLendDeposit,
    { rejectWithValue, dispatch },
  ) => {
    if (!lendingPool) return rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));

    let tx: ContractTransaction;

    if (canClaim) {
      tx = await lendingPool.safeLendAndClaim(deposit.value);
    } else if (canCompound) {
      tx = await lendingPool.safeLendAndCompound(deposit.value);
    } else {
      tx = await lendingPool.lend(deposit.value);
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `lendDepositPending`,
      id: 'lendDeposit',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setLendingStep(STEPS.LEND_DEPOSIT_COMPLETED));
    }

    if (receipt.status !== 1) rejectWithValue('Deposit Failed');
  },
);

// export type thunkLendWithSignature = {
//   wallet: WalletState;
//   account: string;
//   token: Erc20Abi;
//   deposit: BigNumberReference;
//   lendingPool: LendingPoolAbi;
// };

// export const ThunkLendWithSignature = createAsyncThunk(
//   THUNKS.LEND_WITH_SIGNATURE,
//   async (
//     { wallet, account, token, deposit, lendingPool }: thunkLendWithSignature,
//     { rejectWithValue, dispatch },
//   ) => {
//     if (!lendingPool) return rejectWithValue('Missing staking contract');
//     dispatch(setTx({ status: null, hash: null }));
//     let tx: ContractTransaction;
//     let r: string;
//     let v: number;
//     let s: string;

//     try {
//       ({ r, v, s } = await getPermitSignature(
//         wallet,
//         account,
//         token,
//         lendingPool.address,
//         deposit.value,
//         DEADLINE,
//       ));
//     } catch (e) {
//       console.error(e);
//       return rejectWithValue('Permit Signature Failed');
//     }
//     try {
//       tx = await lendingPool.lendWithSignature(
//         deposit.value,
//         DEADLINE,
//         v,
//         r,
//         s,
//       );
//     } catch (err) {
//       console.error(err);
//       rejectWithValue('Deposit Failed');
//     }

//     const { hash } = tx;
//     dispatch(setTxHash(hash));

//     pendingNotification({
//       title: `lendDepositPending`,
//       id: 'lendDeposit',
//     });

//     dispatch(
//       setTx({
//         hash: tx.hash,
//         status: TX_STATES.PENDING,
//       }),
//     );

//     const receipt = await tx.wait();

//     if (receipt.status === 1) {
//       dispatch(setLendingStep(STEPS.LEND_DEPOSIT_COMPLETED));
//     }

//     return receipt.status === 1
//       ? { deposit }
//       : rejectWithValue('Deposit Failed');
//   },
// );

export type ThunkLendClaimRewards = {
  lendingPool: LendingPoolAbi;
};

export const thunkLendClaimRewards = createAsyncThunk(
  THUNKS.CLAIM_REWARDS,
  async (
    { lendingPool }: ThunkLendClaimRewards,
    { rejectWithValue, dispatch },
  ) => {
    if (!lendingPool) return rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));
    const tx = await lendingPool.claim();

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `claimLendRewardsPending`,
      id: 'claimLendRewards',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setLendingStep(STEPS.LEND_REWARDS_CLAIM_COMPLETED));
    }

    if (receipt.status === 1) rejectWithValue('Claim Failed');
  },
);

export type ThunkRequestWithdrawal = {
  lendingPool: LendingPoolAbi;
  preference: (typeof PREFERENCES)[keyof typeof PREFERENCES];
  canClaim: boolean;
  canCompound: boolean;
};

export const thunkChangePreference = createAsyncThunk(
  THUNKS.CHANGE_PREFERENCE,
  async (
    { lendingPool, preference, canClaim, canCompound }: ThunkRequestWithdrawal,
    { rejectWithValue, dispatch },
  ) => {
    if (!lendingPool) rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));

    let tx: ContractTransaction;

    if (canClaim) {
      tx = await lendingPool.claimAndSetPreference(preference);
    } else if (canCompound) {
      tx = await lendingPool.compoundAndSetPreference(preference);
    } else {
      tx = await lendingPool.setPreference(preference);
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `changePreferencePending`,
      id: 'changePreference',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setPreference(preference));
      dispatch(setLendingStep(STEPS.CHANGE_PREFERENCE_COMPLETED));
    }

    if (receipt.status !== 1) rejectWithValue('Change Preference Failed');
  },
);

export type ThunkWithdraw = {
  lendingPool: LendingPoolAbi;
};

export const thunkWithdraw = createAsyncThunk(
  THUNKS.WITHDRAW,
  async ({ lendingPool }: ThunkWithdraw, { rejectWithValue, dispatch }) => {
    if (!lendingPool) return rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));
    const tx = await lendingPool.safeClaimAndWithdraw();

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `withdrawPending`,
      id: 'withdraw',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setLendingStep(STEPS.WITHDRAW_CONFIRM_COMPLETED));
    }

    if (receipt.status !== 1) rejectWithValue('Withdraw Failed');
  },
);

export type ThunkUnloan = {
  lendingPool: LendingPoolAbi;
  amount: BigNumberReference;
};

export const thunkUnlend = createAsyncThunk(
  THUNKS.UNLOAN,
  async (
    { lendingPool, amount }: ThunkUnloan,
    { rejectWithValue, dispatch },
  ) => {
    if (!lendingPool) return rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));
    const tx = await lendingPool.unlend(amount.value);

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `withdrawPending`,
      id: 'withdraw',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setLendingStep(STEPS.UNLEND_COMPLETED));
    }

    if (receipt.status !== 1) rejectWithValue('Withdraw Failed');
  },
);

export type ThunkCompoundYield = {
  lendingPool: LendingPoolAbi;
};

export const thunkCompoundYield = createAsyncThunk(
  THUNKS.COMPOUND_YIELD,
  async (
    { lendingPool }: ThunkCompoundYield,
    { rejectWithValue, dispatch },
  ) => {
    if (!lendingPool) rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));

    const tx = await lendingPool.compound();

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `compoundYieldPending`,
      id: 'compoundYield',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status !== 1) rejectWithValue('Compound Yield Failed');
  },
);
