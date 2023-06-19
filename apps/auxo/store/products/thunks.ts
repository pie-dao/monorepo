import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, BigNumberish, ContractTransaction, ethers } from 'ethers';
import {
  YieldvaultAbi,
  Erc20Abi,
  TokenLockerAbi,
  PRVAbi,
  VeAUXOAbi,
  AUXOAbi,
  RollStakerAbi,
  PRVRouterAbi,
  PRVMerkleVerifierAbi,
} from '@shared/util-blockchain';
import filter from 'lodash/filter';
import { promiseObject } from '../../utils/promiseObject';
import { percentageBetween, toBalance } from '../../utils/formatBalance';
import {
  contractWrappers,
  stakingContract,
  xAUXOContract,
  veAUXOContract,
  rollStakerContract,
  auxoContract,
  PrvMerkleVerifierContract,
} from './products.contracts';
import { BigNumberReference, Tokens } from './products.types';
import { pendingNotification } from '../../components/Notifications/Notifications';
import {
  setStep,
  setTx,
  setTxHash,
  setTxState,
  setShowCompleteModal,
  setState,
  initialState,
  setIsIncreasedValue,
} from '../modal/modal.slice';
import { Steps, STEPS, TX_STATES } from '../modal/modal.types';
import { getPermitSignature } from '../../utils/permit';
import { ONE_HOUR_DEADLINE } from '../../utils/constants';
import {
  PrvWithdrawalMerkleTree,
  PrvWithdrawalRecipient,
} from '../../types/merkleTree';
import { isEmpty } from 'lodash';
import PrvWithdrawalTree from '../../config/PrvWithdrawalTree.json';
import { defaultAbiCoder } from '@ethersproject/abi';
import { WalletState, EIP1193Provider } from '@web3-onboard/core';

export const THUNKS = {
  GET_PRODUCTS_DATA: 'app/getProductsData',
  GET_VE_AUXO_STAKING_DATA: 'app/getVeAUXOStakingData',
  GET_X_AUXO_STAKING_DATA: 'app/getXAUXOStakingData',
  GET_USER_PRODUCTS_DATA: 'app/getUserProductsData',
  GET_USER_STAKING_DATA: 'app/getUserStakingData',
  GET_USER_VAULTS_DATA: 'app/getUserVaultsData',
  APPROVE_STAKE_AUXO: 'ARV/approveStakeAUXO',
  STAKE_AUXO: 'ARV/stakeAUXO',
  INCREASE_STAKE_AUXO: 'ARV/increaseStakeAUXO',
  CONVERT_X_AUXO: 'PRV/convertXAUXO',
  STAKE_X_AUXO: 'PRV/stakeXAUXO',
  UNSTAKE_X_AUXO: 'PRV/unstakeXAUXO',
  BOOST_VE_AUXO: 'PRV/boostVeAUXO',
  INCREASE_LOCK_VE_AUXO: 'ARV/increaseLockVeAUXO',
  WITHDRAW_VE_AUXO: 'ARV/withdrawVeAUXO',
  GET_USER_REWARDS: 'app/getUserRewards',
  EARLY_TERMINATION: 'ARV/earlyTermination',
  WITHDRAW_PRV: 'PRV/withdrawPRV',
  DELEGATE_VOTE: 'ARV/delegateVote',
};

const sum = (x: ethers.BigNumber, y: ethers.BigNumber) => x.add(y);
const sumBalance = (x: number, y: number) => x + y;
const deadline = Math.floor(Date.now() / 1000 + ONE_HOUR_DEADLINE).toString();

const prvTree = PrvWithdrawalTree as PrvWithdrawalMerkleTree;

export const thunkGetProductsData = createAsyncThunk(
  THUNKS.GET_PRODUCTS_DATA,
  async (_, { rejectWithValue }) => {
    try {
      const productDataResults = await Promise.allSettled(
        contractWrappers.map((contractWrapper) => {
          const results = promiseObject({
            productDecimals: contractWrapper.decimals(),
            symbol: contractWrapper.symbol(),
            addresses: contractWrapper._multichainConfig,
          });
          return results;
        }),
      );
      const results = productDataResults.map((result): Tokens => {
        if (result.status === 'fulfilled') {
          return {
            [result.value.symbol]: {
              productDecimals: result.value.productDecimals,
              chainInfo: Object.assign(
                {},
                ...Object.entries(result.value.addresses).map(
                  ([chainId, config]) => ({
                    [chainId]: {
                      address: config.address,
                    },
                  }),
                ),
              ),
            },
          };
        }
      });
      return Object.assign({}, ...results);
    } catch (e) {
      console.error('thunkGetProductsData', e);
      return rejectWithValue('Error fetching products data');
    }
  },
);

export const thunkGetUserProductsData = createAsyncThunk(
  THUNKS.GET_USER_PRODUCTS_DATA,
  async (
    {
      account,
      provider,
      spender,
    }: { account: string; provider: EIP1193Provider; spender?: string },
    { rejectWithValue },
  ) => {
    if (!account || !provider) return;
    try {
      const productDataResults = await Promise.allSettled(
        contractWrappers.map((contractWrapper) => {
          const results = promiseObject({
            balances: contractWrapper.multichain.balanceOf(account),
            productDecimals: contractWrapper.decimals(),
            symbol: contractWrapper.symbol(),
            addresses: contractWrapper._multichainConfig,
            allowances: spender
              ? contractWrapper.multichain.allowance(account, spender)
              : null,
          });
          return results;
        }),
      );

      const enrichWithTotalBalance = productDataResults.map(
        (result): Tokens => {
          if (result.status === 'fulfilled' && result.value.balances.data) {
            const filterFulfilled = Object.values(
              result.value.balances.data,
            ).filter(
              (value) => value.status === 'fulfilled',
            ) as PromiseFulfilledResult<BigNumber>[];
            const totalBalanceBN = filterFulfilled
              .map((balance) => balance.value)
              .reduce(sum, ethers.constants.Zero);
            const totalBalance = toBalance(
              totalBalanceBN,
              result.value.productDecimals,
            );

            const balances = Object.entries(result.value.balances.data).filter(
              ([, value]) => value.status === 'fulfilled',
            ) as [string, PromiseFulfilledResult<BigNumber>][];

            const balancesFormatted = balances.map(([key, amount]) => ({
              [key]: toBalance(amount.value, result.value.productDecimals),
            }));

            let allowancesFormatted: { [x: string]: BigNumberReference }[];

            if (result?.value?.allowances?.data && spender) {
              const allowances = Object.entries(
                result.value.allowances.data,
              ).filter(([, value]) => value.status === 'fulfilled') as [
                string,
                PromiseFulfilledResult<BigNumber>,
              ][];
              allowancesFormatted = allowances.map(([key, amount]) => ({
                [key]: toBalance(amount.value, result.value.productDecimals),
              }));
            }

            return {
              [result.value.symbol]: {
                chainInfo: Object.assign(
                  {},
                  ...Object.entries(result.value.addresses).map(
                    ([chainId, config]) => ({
                      [chainId]: {
                        address: config.address,
                        balance: balancesFormatted.find(
                          (balance) => balance[chainId],
                        )?.[chainId],
                        allowance:
                          spender && allowancesFormatted
                            ? {
                                [spender]: allowancesFormatted.find(
                                  (allowance) => allowance[chainId],
                                )?.[chainId],
                              }
                            : null,
                      },
                    }),
                  ),
                ),
                productDecimals: result.value.productDecimals,
                totalBalance,
              },
            };
          }
        },
      );

      const totalBalances = enrichWithTotalBalance
        .map((result) => {
          return Number(Object.values(result)[0].totalBalance.label);
        })
        .reduce(sumBalance, 0);

      const tokens = Object.assign({}, ...enrichWithTotalBalance);

      const networksUsed = enrichWithTotalBalance.map((result) => {
        return Object.values(result)[0].chainInfo;
      });

      const uniqueNetworksPerChain = Object.assign(
        {},
        ...Object.values(networksUsed),
      );

      const uniqueNetworks = filter(
        uniqueNetworksPerChain,
        ({ label }) => label !== 0,
      ).length;

      const totalAssets = enrichWithTotalBalance.filter((result) => {
        return Object.values(result)[0].totalBalance.label !== 0;
      }).length;

      return {
        tokens,
        uniqueNetworks,
        totalAssets,
        totalBalances,
      };
    } catch (e) {
      console.error('thunkGetUserProductsData', e);
      return rejectWithValue('Error fetching user products data');
    }
  },
);

export const thunkGetVeAUXOStakingData = createAsyncThunk(
  THUNKS.GET_VE_AUXO_STAKING_DATA,
  async (_, { rejectWithValue }) => {
    try {
      // const depositedFilter = stakingContract.filters.Deposited();
      const results = promiseObject({
        stakingAmount: auxoContract.balanceOf(stakingContract.address),
        stakingToken: stakingContract.depositToken(),
        decimals: veAUXOContract.decimals(),
        totalSupply: veAUXOContract.totalSupply(),
        earlyTerminationFee: stakingContract.earlyExitFee(),
        // tokensDeposited: stakingContract.queryFilter(depositedFilter),
      });
      const stakingData = await results;
      // const uniqueAddresses = new Set<string>();
      // stakingData.tokensDeposited.map(({ args }) => {
      //   uniqueAddresses.add(args.owner);
      // });

      // const checkForCurrentVotingPower = async () => {
      //   let totalVotingAdresses = 0;
      //   const currentVotingPower = [...uniqueAddresses].map(async (address) => {
      //     await veAUXOContract.getVotes(address).then((votePower) => {
      //       if (!votePower.isZero()) {
      //         totalVotingAdresses++;
      //       }
      //     });
      //     return totalVotingAdresses;
      //   });
      //   await Promise.all(currentVotingPower);
      //   return totalVotingAdresses;
      // };

      // const currentVotingPower = await checkForCurrentVotingPower();
      return {
        ['ARV']: {
          stakingAmount: toBalance(
            stakingData.stakingAmount,
            stakingData.decimals,
          ),
          stakingToken: stakingData.stakingToken,
          totalSupply: toBalance(stakingData.totalSupply, stakingData.decimals),
          earlyTerminationFee: toBalance(
            stakingData.earlyTerminationFee,
            stakingData.decimals,
          ),
          // votingAddresses: currentVotingPower,
        },
      };
    } catch (e) {
      console.error('thunkGetVeAUXOStakingData', e);
      return rejectWithValue('Error fetching ARV staking data');
    }
  },
);

export const thunkGetXAUXOStakingData = createAsyncThunk(
  THUNKS.GET_X_AUXO_STAKING_DATA,
  async (_, { rejectWithValue }) => {
    try {
      const results = promiseObject({
        // includes pending stakes
        stakingAmount: rollStakerContract.getProjectedNextEpochBalance(),
        // currentWithdrawalAmount: PrvMerkleVerifierContract.budgetRemaining(
        //   prvTree?.windowIndex,
        // ),
        decimals: xAUXOContract.decimals(),
        totalSupply: xAUXOContract.totalSupply(),
        fee: xAUXOContract.fee(),
      });

      const stakingData = await results;
      return {
        ['PRV']: {
          stakingAmount: toBalance(
            stakingData.stakingAmount,
            stakingData.decimals,
          ),
          totalSupply: toBalance(stakingData.totalSupply, stakingData.decimals),
          fee: toBalance(
            stakingData.fee.mul(BigNumber.from(100)),
            stakingData.decimals,
          ),
          // currentWithdrawalAmount: toBalance(
          //   stakingData.currentWithdrawalAmount,
          //   stakingData.decimals,
          // ),
        },
      };
    } catch (e) {
      console.error('thunkGetXAUXOStakingData', e);
      return rejectWithValue('Error fetching PRV staking data');
    }
  },
);

export const thunkGetUserStakingData = createAsyncThunk(
  THUNKS.GET_USER_STAKING_DATA,
  async (
    { account, provider }: { account: string; provider: EIP1193Provider },
    { rejectWithValue },
  ) => {
    if (!account || !provider) return;

    try {
      const veAUXOresults = promiseObject({
        lock: stakingContract.lockOf(account),
        decimals: veAUXOContract.decimals(),
        totalSupply: veAUXOContract.totalSupply(),
        delegation: veAUXOContract.delegates(account),
      });

      const xAUXOResults = promiseObject({
        balance: rollStakerContract.getTotalBalanceForUser(account),
        currentEpochBalance:
          rollStakerContract.getActiveBalanceForUser(account),
        pendingBalance: rollStakerContract.getPendingBalanceForUser(account),
        decimals: xAUXOContract.decimals(),
      });

      const veAUXOData = await veAUXOresults;
      const xAUXOData = await xAUXOResults;

      const isSelfDelegate =
        veAUXOData.delegation.toLowerCase() === account.toLowerCase();

      const votes = isSelfDelegate
        ? await veAUXOContract.getVotes(account)
        : BigNumber.from(0);

      return {
        ['ARV']: {
          userStakingData: {
            amount: toBalance(veAUXOData.lock.amount, veAUXOData.decimals),
            lockedAt: veAUXOData.lock.lockedAt,
            lockDuration: veAUXOData.lock.lockDuration,
            votingPower: percentageBetween(
              votes,
              veAUXOData.totalSupply,
              veAUXOData.decimals,
            ),
            delegator: veAUXOData.delegation,
          },
        },
        ['PRV']: {
          userStakingData: {
            amount: toBalance(xAUXOData.balance, xAUXOData.decimals),
            currentEpochBalance: toBalance(
              xAUXOData.currentEpochBalance,
              xAUXOData.decimals,
            ),
            pendingBalance: toBalance(
              xAUXOData.pendingBalance,
              xAUXOData.decimals,
            ),
          },
        },
      };
    } catch (e) {
      console.error('thunkGetUserStakingData', e);
      return rejectWithValue('Error fetching user staking data');
    }
  },
);

/**
 * Start the batch burn process by requesting the burning of the users' existing auxo tokens.
 * Users can increase the number of tokens to be converted up and until the batch burn process has completed.
 */
export type ThunkIncreaseWithdrawalProps = {
  withdraw: BigNumberReference;
  auxo: YieldvaultAbi | undefined;
};

export type ThunkApproveDepositProps = {
  deposit: BigNumberReference;
  token: Erc20Abi | undefined;
  spender: string;
};

export type ThunkApproveTokenProps = {
  deposit: BigNumberReference;
  token: Erc20Abi | PRVAbi | VeAUXOAbi | undefined;
  spender: string;
  nextStep: Steps;
};
export const thunkApproveToken = createAsyncThunk(
  THUNKS.APPROVE_STAKE_AUXO,
  async (
    { deposit, token, spender, nextStep }: ThunkApproveTokenProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!token || !spender)
      return rejectWithValue('Missing token or staking contract');
    const tx = await token.approve(spender, deposit.value);

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
      dispatch(setTxState(TX_STATES.COMPLETE));
      dispatch(setStep(nextStep));
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Approval Failed');
  },
);

export type ThunkStakeAuxoProps = {
  wallet: WalletState;
  deposit: BigNumberReference;
  stakingTime: BigNumberish;
  tokenLocker: TokenLockerAbi | undefined;
  AUXOToken: AUXOAbi;
  account: string | null | undefined;
};
export const thunkStakeAuxo = createAsyncThunk(
  THUNKS.STAKE_AUXO,
  async (
    {
      deposit,
      tokenLocker,
      account,
      stakingTime,
      wallet,
      AUXOToken,
    }: ThunkStakeAuxoProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !account || !stakingTime || !deposit)
      return rejectWithValue('Missing Contract, Account Details or Deposit');
    dispatch(setTx({ status: null, hash: null }));
    let tx: ContractTransaction;
    let r: string;
    let v: number;
    let s: string;

    try {
      ({ r, v, s } = await getPermitSignature(
        wallet,
        account,
        AUXOToken,
        tokenLocker.address,
        deposit.value,
        deadline,
      ));
    } catch (e) {
      console.error(e);
      return rejectWithValue('Permit Signature Failed');
    }

    try {
      tx = await tokenLocker.depositByMonthsWithSignature(
        deposit.value,
        stakingTime,
        account,
        deadline,
        v,
        r,
        s,
      );
    } catch (e) {
      console.error(e);
      return rejectWithValue('Deposit Failed');
    }

    const { hash } = tx;
    dispatch(setTx({ status: TX_STATES.PENDING, hash }));

    pendingNotification({
      title: `stakeAuxoPending`,
      id: 'stakeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setShowCompleteModal(true));
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(
        setTx({
          hash,
          status: TX_STATES.COMPLETE,
        }),
      );
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Deposit Failed');
  },
);

export type ThunkIncreaseStakeAuxoProps = {
  account: string;
  deposit: BigNumberReference;
  tokenLocker: TokenLockerAbi | undefined;
  wallet: WalletState;
  AUXOToken: AUXOAbi;
};

export const thunkIncreaseStakeAuxo = createAsyncThunk(
  THUNKS.INCREASE_STAKE_AUXO,
  async (
    {
      account,
      wallet,
      deposit,
      tokenLocker,
      AUXOToken,
    }: ThunkIncreaseStakeAuxoProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !deposit)
      return rejectWithValue('Missing Contract, Account Details or Deposit');
    dispatch(setTx({ status: null, hash: null }));

    let tx: ContractTransaction;
    let r: string;
    let v: number;
    let s: string;

    try {
      ({ r, v, s } = await getPermitSignature(
        wallet,
        account,
        AUXOToken,
        tokenLocker.address,
        deposit.value,
        deadline,
      ));
    } catch (e) {
      console.error(e);
      return rejectWithValue('Permit Signature Failed');
    }

    try {
      tx = await tokenLocker.increaseAmountWithSignature(
        deposit.value,
        deadline,
        v,
        r,
        s,
      );
    } catch (e) {
      console.error(e);
      return rejectWithValue('Increase Amount Failed');
    }

    const { hash } = tx;
    dispatch(setTx({ status: TX_STATES.PENDING, hash }));

    pendingNotification({
      title: `increaseStakeAuxoPending`,
      id: 'increaseStakeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setIsIncreasedValue(true));
      dispatch(setShowCompleteModal(true));
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(
        setTx({
          hash,
          status: TX_STATES.COMPLETE,
        }),
      );
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Deposit Failed');
  },
);

export type ThunkBoostToMaxVeAUXO = {
  account: string;
  tokenLocker: TokenLockerAbi | undefined;
};

export const thunkBoostToMaxVeAUXO = createAsyncThunk(
  THUNKS.BOOST_VE_AUXO,
  async (
    { account, tokenLocker }: ThunkBoostToMaxVeAUXO,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !account)
      return rejectWithValue('Missing Contract or Account Details');
    dispatch(setTxHash(null));

    const tx = await tokenLocker.boostToMax();

    // set block explorer transaction hash

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `boostVeAuxoPending`,
      id: 'boostToMaxVeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setShowCompleteModal(true));
      dispatch(thunkGetVeAUXOStakingData());
    }

    if (receipt.status !== 1) return rejectWithValue('Boost Failed');
  },
);

export type ThunkWithdrawFromVeAUXO = {
  tokenLocker: TokenLockerAbi | undefined;
  account: string;
};

export const thunkWithdrawFromVeAUXO = createAsyncThunk(
  THUNKS.WITHDRAW_VE_AUXO,
  async (
    { account, tokenLocker }: ThunkBoostToMaxVeAUXO,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !account)
      return rejectWithValue('Missing Contract or Account Details');
    dispatch(setTxHash(null));

    const tx = await tokenLocker.withdraw();

    // set block explorer transaction hash

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `withdrawVeAuxoPending`,
      id: 'withdrawVeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setStep(STEPS.WITHDRAW_ARV_COMPLETED));
      dispatch(thunkGetVeAUXOStakingData());
    }

    if (receipt.status !== 1) return rejectWithValue('Withdraw Failed');
  },
);

export type ThunkIncreaseLockVeAUXO = {
  tokenLocker: TokenLockerAbi | undefined;
  account: string;
  months: number;
};

export const thunkIncreaseLockVeAUXO = createAsyncThunk(
  THUNKS.INCREASE_LOCK_VE_AUXO,
  async (
    { months, account, tokenLocker }: ThunkIncreaseLockVeAUXO,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !months || !account)
      return rejectWithValue('Missing Contract, Account Details or months');
    dispatch(setTx({ status: null, hash: null }));

    const tx = await tokenLocker.increaseByMonths(months);

    // set block explorer transaction hash

    const { hash } = tx;
    dispatch(setTx({ status: TX_STATES.PENDING, hash }));
    pendingNotification({
      title: `increaseLockVeAuxoPending`,
      id: 'increaseLockVeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(setState(initialState));
    }

    if (receipt.status !== 1) return rejectWithValue('Withdraw Failed');
  },
);

export type ThunkConvertXAUXOProps = {
  deposit: BigNumberReference;
  auxoContract: AUXOAbi | undefined;
  xAUXOContract?: PRVAbi | undefined;
  account: string;
  wallet: WalletState;
  isConvertAndStake: boolean;
  PRVRouterContract?: PRVRouterAbi;
};

export const thunkConvertXAUXO = createAsyncThunk(
  THUNKS.CONVERT_X_AUXO,
  async (
    {
      wallet,
      account,
      deposit,
      auxoContract,
      xAUXOContract,
      isConvertAndStake,
      PRVRouterContract,
    }: ThunkConvertXAUXOProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!deposit || !auxoContract || !account)
      return rejectWithValue('Missing Contract, Account Details or Deposit');

    // const tx = await xAUXOContract.depositFor(account, deposit.value);
    let tx: ContractTransaction;
    let r: string;
    let v: number;
    let s: string;

    try {
      ({ r, v, s } = await getPermitSignature(
        wallet,
        account,
        auxoContract,
        isConvertAndStake ? PRVRouterContract.address : xAUXOContract.address,
        deposit.value,
        deadline,
      ));
    } catch (e) {
      console.error(e);
      return rejectWithValue('Permit Signature Failed');
    }

    if (isConvertAndStake) {
      try {
        tx = await PRVRouterContract.convertAndStakeWithSignature(
          deposit.value,
          account,
          deadline,
          v,
          r,
          s,
        );
      } catch (e) {
        console.error(e);
        return rejectWithValue('Convert and Stake Failed');
      }
    } else {
      try {
        tx = await xAUXOContract.depositForWithSignature(
          account,
          deposit.value,
          deadline,
          v,
          r,
          s,
        );
      } catch (e) {
        console.error(e);
        return rejectWithValue('Convert Failed');
      }
    }

    // set block explorer transaction hash

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `convertXAUXOPending`,
      id: 'convertXAUXO',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setStep(STEPS.CONVERT_COMPLETED));
      dispatch(thunkGetXAUXOStakingData());
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Deposit Failed');
  },
);

export type ThunkStakeXAUXOProps = {
  deposit: BigNumberReference;
  account: string;
  wallet: WalletState;
  xAUXO: PRVAbi | undefined;
  rollStaker: RollStakerAbi | undefined;
};

export const thunkStakeXAUXO = createAsyncThunk(
  THUNKS.STAKE_X_AUXO,
  async (
    { wallet, account, deposit, xAUXO, rollStaker }: ThunkStakeXAUXOProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!deposit || !account || !xAUXO || !wallet || !rollStaker)
      return rejectWithValue(
        'Missing Contract, Account Details, Deposit, xAUXO or Signer',
      );

    let tx: ContractTransaction;
    let r: string;
    let v: number;
    let s: string;

    try {
      ({ r, v, s } = await getPermitSignature(
        wallet,
        account,
        xAUXO,
        rollStaker.address,
        deposit.value,
        deadline,
      ));
    } catch (e) {
      console.error(e);
      return rejectWithValue('Permit Signature Failed');
    }

    dispatch(setTxHash(null));
    try {
      tx = await rollStaker.depositWithSignature(
        deposit.value,
        deadline,
        v,
        r,
        s,
      );
    } catch (e) {
      console.error(e);
      return rejectWithValue('Deposit Failed');
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `stakeXAUXOPending`,
      id: 'stakeXAUXO',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setShowCompleteModal(true));
      dispatch(thunkGetXAUXOStakingData());
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Deposit Failed');
  },
);

export type ThunkUnstakeXAUXOProps = {
  amount: BigNumberReference;
  account: string;
  rollStaker: RollStakerAbi | undefined;
  shouldRevertDeposit: boolean;
};

export const thunkUnstakeXAUXO = createAsyncThunk(
  THUNKS.UNSTAKE_X_AUXO,
  async (
    {
      account,
      amount,
      rollStaker,
      shouldRevertDeposit,
    }: ThunkUnstakeXAUXOProps,
    { rejectWithValue, dispatch },
  ) => {
    if (
      !amount ||
      !account ||
      !rollStaker ||
      typeof shouldRevertDeposit === 'undefined'
    )
      return rejectWithValue('Missing Contract, Account Details and Amount');

    dispatch(setTxHash(null));
    const tx = await rollStaker.withdraw(amount.value);

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `unstakeXAUXOPending`,
      id: 'unstakeXAUXO',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setStep(STEPS.UNSTAKE_COMPLETED));
      dispatch(thunkGetXAUXOStakingData());
    }

    return receipt.status === 1
      ? { amount }
      : rejectWithValue('Withdraw Failed');
  },
);

export type ThunkEarlyTerminationProps = {
  tokenLocker: TokenLockerAbi | undefined;
  account: string | null | undefined;
};
export const thunkEarlyTermination = createAsyncThunk(
  THUNKS.EARLY_TERMINATION,
  async (
    { tokenLocker, account }: ThunkEarlyTerminationProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !account)
      return rejectWithValue('Missing Contract, Account Details or Deposit');
    dispatch(setTxHash(null));
    let tx: ContractTransaction;

    try {
      tx = await tokenLocker.terminateEarly();
    } catch (e) {
      console.error(e);
      return rejectWithValue('Terminate Early Failed');
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `earlyTerminationPending`,
      id: 'earlyTermination',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setStep(STEPS.EARLY_TERMINATION_COMPLETED));
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(thunkGetXAUXOStakingData());
    }

    return receipt.status !== 1 && rejectWithValue('Terminate Early Failed');
  },
);

export type ThunkUserPrvWithdrawal = {
  account: string;
  claim: PrvWithdrawalRecipient & { account: string };
  prvMerkleVerifier: PRVMerkleVerifierAbi;
};

export const thunkGetUserPrvWithdrawal = createAsyncThunk(
  THUNKS.GET_USER_REWARDS,
  async (
    { account, claim, prvMerkleVerifier }: ThunkUserPrvWithdrawal,
    { rejectWithValue },
  ) => {
    try {
      if (!account || isEmpty(claim))
        return rejectWithValue('Missing Account Details or Rewards');
      const { proof: merkleProof, ...rest } = claim;
      const amountToClaim = await prvMerkleVerifier.availableToWithdrawInClaim({
        ...rest,
        merkleProof,
      });

      return {
        ['PRV']: {
          userStakingData: {
            claimableAmount: toBalance(amountToClaim, 18),
          },
        },
      };
    } catch (e) {
      console.error(e);
      return rejectWithValue('Get User Rewards Failed');
    }
  },
);

export type ThunkWithdrawPrvProps = {
  amount: BigNumberReference;
  account: string;
  PRV: PRVAbi | undefined;
  claim: PrvWithdrawalRecipient & { account: string };
};

export const ThunkWithdrawPrv = createAsyncThunk(
  THUNKS.WITHDRAW_PRV,
  async (
    { account, amount, PRV, claim }: ThunkWithdrawPrvProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!amount || !account || !PRV || isEmpty(claim))
      return rejectWithValue('Missing Contract, Account Details and Amount');

    const encodedClaim = defaultAbiCoder.encode(
      ['tuple(uint256,uint256,bytes32[],address)'],
      [[claim.windowIndex, claim.amount, claim.proof, account]],
    );

    let tx: ContractTransaction;
    dispatch(setTxHash(null));
    try {
      tx = await PRV.withdraw(amount.value, encodedClaim);
    } catch (e) {
      console.error(e);
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `withdrawPrvPending`,
      id: 'withdrawPrv',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setStep(STEPS.WITHDRAW_PRV_COMPLETED));
      dispatch(thunkGetXAUXOStakingData());
    }

    return receipt.status === 1
      ? { amount }
      : rejectWithValue('Withdraw Failed');
  },
);

export type ThunkDelegateVoteProps = {
  account: string;
  ARV: VeAUXOAbi | undefined;
};

export const thunkDelegateVote = createAsyncThunk(
  THUNKS.DELEGATE_VOTE,
  async (
    { account, ARV }: ThunkDelegateVoteProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!account || !ARV)
      return rejectWithValue('Missing Account Details or Contract');

    dispatch(setTxHash(null));
    let tx: ContractTransaction;

    try {
      tx = await ARV.delegate(account);
    } catch (e) {
      console.error(e);
      return rejectWithValue('Delegate Failed');
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `delegateVotePending`,
      id: 'delegateVote',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(thunkGetXAUXOStakingData());
    }

    return receipt.status !== 1 && rejectWithValue('Delegate Failed');
  },
);
