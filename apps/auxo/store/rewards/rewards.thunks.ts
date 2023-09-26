import { ContractTransaction, ethers } from 'ethers';
import { isEmpty } from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  UserMerkleTree,
  UserMerkleTreeDissolution,
} from '../../types/merkleTree';
import { merkleDistributorContract } from '../products/products.contracts';
import { MerkleDistributorAbi, ClaimHelperAbi } from '@shared/util-blockchain';
import {
  setTxHash,
  setShowCompleteModal,
  setClaimStep,
} from '../rewards/rewards.slice';
import { pendingNotification } from '../../components/Notifications/Notifications';
import { addBalances, zeroBalance } from '../../utils/balances';
import { Month, Data, STEPS, SliceState, TokenName } from './rewards.types';
import { promiseObject } from '../../utils/promiseObject';
import daoContracts from '../../config/daoContracts.json';

export const THUNKS = {
  GET_USER_REWARDS: 'rewards/getUserRewards',
  COMPOUND_REWARDS: 'rewards/compoundRewards',
  STOP_COMPOUND_REWARDS: 'rewards/stopCompoundRewards',
  CLAIM_REWARDS: 'rewards/claimRewards',
  CLAIM_DISSOLUTION: 'rewards/claimDissolution',
  GET_USER_DISSOLUTION: 'rewards/getUserDissolution',
};

export type ThunkClaimRewards = {
  claim:
    | Parameters<MerkleDistributorAbi['claim']>[0]
    | Parameters<MerkleDistributorAbi['claimMulti']>[0];
  merkleDistributor: MerkleDistributorAbi;
  isSingleClaim: boolean;
  token?: string;
  account: string;
  userRewards: UserMerkleTree;
};

export const thunkClaimRewards = createAsyncThunk(
  THUNKS.CLAIM_REWARDS,
  async (
    {
      isSingleClaim,
      claim,
      merkleDistributor,
      account,
      userRewards,
    }: ThunkClaimRewards,
    { rejectWithValue, dispatch },
  ) => {
    if (isEmpty(claim) || !merkleDistributor || !account)
      return rejectWithValue('Missing Contract, Account Details or Rewards');

    dispatch(setTxHash(null));
    let tx: ContractTransaction;
    let claims: Parameters<MerkleDistributorAbi['claimMulti']>[0] = [];
    if (Array.isArray(claim)) {
      claims = claim;
    } else {
      claims.push(claim);
    }

    try {
      tx = isSingleClaim
        ? await merkleDistributor.claim(claims[0])
        : await merkleDistributor.claimMulti(claims);
    } catch (e) {
      console.error(e);
      return rejectWithValue('Claim Rewards Failed');
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `claimRewardsPending`,
      id: 'claimRewards',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setShowCompleteModal(true));
      dispatch(
        thunkGetUserRewards({
          account,
          rewards: userRewards,
        }),
      );
      return receipt.status;
    }

    return receipt.status !== 1 && rejectWithValue('Claim Rewards Failed');
  },
);

export type ThunkClaimDissolution = {
  claims: Parameters<MerkleDistributorAbi['claimMulti']>[0];
  merkleDistributor: MerkleDistributorAbi;
  token?: string;
  account: string;
  userRewards: UserMerkleTreeDissolution;
};

export const thunkClaimDissolution = createAsyncThunk(
  THUNKS.CLAIM_DISSOLUTION,
  async (
    { claims, merkleDistributor, account, userRewards }: ThunkClaimDissolution,
    { rejectWithValue, dispatch },
  ) => {
    if (
      isEmpty(claims) ||
      !merkleDistributor ||
      !account ||
      isEmpty(userRewards)
    )
      return rejectWithValue('Missing Contract, Account Details or Rewards');

    dispatch(setTxHash(null));
    let tx: ContractTransaction;
    const isSingleClaim = claims?.length === 1;
    try {
      tx = isSingleClaim
        ? await merkleDistributor.claim(claims[0])
        : await merkleDistributor.claimMulti(claims);
    } catch (e) {
      console.error(e);
      return rejectWithValue('Claim Rewards Failed');
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `claimRewardsPending`,
      id: 'claimRewards',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setClaimStep(STEPS.CLAIM_DISSOLUTION_COMPLETED));
      dispatch(
        thunkGetUserDissolution({
          account,
          rewards: userRewards,
        }),
      );
      return receipt.status;
    }

    return receipt.status !== 1 && rejectWithValue('Claim Rewards Failed');
  },
);

export type ThunkCompoundRewards = {
  merkleDistributor: MerkleDistributorAbi;
  token: TokenName;
  account: string;
  userRewards: UserMerkleTree;
};

export const thunkCompoundRewards = createAsyncThunk(
  THUNKS.COMPOUND_REWARDS,
  async (
    { merkleDistributor, account, userRewards }: ThunkCompoundRewards,
    { rejectWithValue, dispatch },
  ) => {
    if (!account || !merkleDistributor)
      return rejectWithValue('Missing Account Details or Rewards');

    dispatch(setTxHash(null));
    let tx: ContractTransaction;

    try {
      tx = await merkleDistributor.setRewardsDelegate(
        daoContracts.multisigs.operations[1],
      );
    } catch (e) {
      console.error(e);
      return rejectWithValue(
        'There was an error while activating autocompounding',
      );
    }
    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `compoundRewardsPending`,
      id: 'compoundRewards',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(
        thunkGetUserRewards({
          account,
          rewards: userRewards,
        }),
      );
      dispatch(setClaimStep(STEPS.COMPOUND_COMPLETED));
      return receipt.status;
    }

    return receipt.status !== 1 && rejectWithValue('Compound Rewards Failed');
  },
);

export const thunkStopCompoundRewards = createAsyncThunk(
  THUNKS.STOP_COMPOUND_REWARDS,
  async (
    { merkleDistributor, account, userRewards }: ThunkCompoundRewards,
    { rejectWithValue, dispatch },
  ) => {
    if (!account || !merkleDistributor)
      return rejectWithValue('Missing Account Details or Rewards');

    dispatch(setTxHash(null));
    let tx: ContractTransaction;

    try {
      tx = await merkleDistributor.removeRewardsDelegate();
    } catch (e) {
      console.error(e);
      return rejectWithValue(
        'There was an error while deactivating autocompounding',
      );
    }
    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `stopCompoundRewardsPending`,
      id: 'stopCompoundRewards',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(thunkGetUserRewards({ account, rewards: userRewards }));
      return receipt.status;
    }

    return (
      receipt.status !== 1 && rejectWithValue('Stop Compound Rewards Failed')
    );
  },
);

export type ThunkUserRewards = {
  account: string;
  rewards: UserMerkleTree;
};

export const thunkGetUserRewards = createAsyncThunk(
  THUNKS.GET_USER_REWARDS,
  async ({ account, rewards }: ThunkUserRewards, { rejectWithValue }) => {
    try {
      if (!account || isEmpty(rewards))
        return rejectWithValue('Missing Account Details or Rewards');

      const allMonthsPromisify = async () => {
        const rewardPositions: {
          [token: string]: Month[];
        } = {};

        await Promise.all(
          Object.entries(rewards).map(async ([token, recipient]) => {
            const months = await Promise.all(
              Object.entries(recipient).map(async ([month, reward]) => {
                const { windowIndex, accountIndex, rewards, proof } = reward;
                const monthClaimed = await merkleDistributorContract(
                  token,
                ).isClaimed(windowIndex, accountIndex);
                return {
                  month,
                  monthClaimed,
                  rewards: {
                    value: rewards,
                    label: Number(ethers.utils.formatUnits(rewards, 18)),
                  },
                  proof,
                  windowIndex,
                  accountIndex,
                };
              }),
            );
            rewardPositions[token] = months;
          }),
        );

        return rewardPositions;
      };

      const results = await allMonthsPromisify();

      const isCompoundActiveForUser = promiseObject({
        ARV: merkleDistributorContract('ARV').isRewardsDelegate(
          account,
          daoContracts.multisigs.operations[1],
        ),
        PRV: merkleDistributorContract('PRV').isRewardsDelegate(
          account,
          daoContracts.multisigs.operations[1],
        ),
      });

      const isCompoundActive = await isCompoundActiveForUser;

      const data: Data = {
        rewardPositions: {
          ARV: results?.ARV,
          PRV: results?.PRV,
        },
        metadata: {
          ARV: {
            total: results?.ARV
              ? results?.ARV?.filter((value) => !value.monthClaimed)?.reduce(
                  (acc, curr) => {
                    return addBalances(acc, curr.rewards);
                  },
                  zeroBalance,
                )
              : zeroBalance,
            isCompound: isCompoundActive.ARV,
          },
          PRV: {
            total: results?.PRV
              ? results?.PRV?.filter((value) => !value.monthClaimed)?.reduce(
                  (acc, curr) => {
                    return addBalances(acc, curr.rewards);
                  },
                  zeroBalance,
                )
              : zeroBalance,
            isCompound: isCompoundActive.PRV,
          },
          total: addBalances(
            results?.ARV
              ? results?.ARV.filter((value) => !value.monthClaimed)?.reduce(
                  (acc, curr) => {
                    return addBalances(acc, curr.rewards);
                  },
                  zeroBalance,
                )
              : zeroBalance,
            results?.PRV
              ? results?.PRV?.filter((value) => !value.monthClaimed)?.reduce(
                  (acc, curr) => {
                    return addBalances(acc, curr.rewards);
                  },
                  zeroBalance,
                )
              : zeroBalance,
          ),
          allTimeTotal: addBalances(
            results?.ARV
              ? results?.ARV.reduce((acc, curr) => {
                  return addBalances(acc, curr.rewards);
                }, zeroBalance)
              : zeroBalance,
            results?.PRV
              ? results?.PRV?.reduce((acc, curr) => {
                  return addBalances(acc, curr.rewards);
                }, zeroBalance)
              : zeroBalance,
          ),
        },
      };

      return data;
    } catch (e) {
      console.error(e);
    }
  },
);

export type ThunkUserDissolution = {
  account: string;
  rewards: UserMerkleTreeDissolution;
};

export const thunkGetUserDissolution = createAsyncThunk(
  THUNKS.GET_USER_DISSOLUTION,
  async ({ account, rewards }: ThunkUserDissolution, { rejectWithValue }) => {
    try {
      if (!account || !rewards || isEmpty(rewards))
        return rejectWithValue('Missing Account Details or Rewards');

      const allMonthsPromisify = async () => {
        const rewardPositions: Month[] = [];

        await Promise.all(
          Object.entries(rewards).map(async ([month, reward]) => {
            const { windowIndex, accountIndex, rewards, proof } = reward;
            const monthClaimed = await merkleDistributorContract(
              'AUXO',
            ).isClaimed(windowIndex, accountIndex);
            rewardPositions.push({
              month,
              monthClaimed,
              rewards: {
                value: rewards,
                label: Number(ethers.utils.formatUnits(rewards, 18)),
              },
              proof,
              windowIndex,
              accountIndex,
            });
          }),
        );

        return rewardPositions;
      };

      const results = await allMonthsPromisify();

      return results;
    } catch (e) {
      console.error(e);
    }
  },
);

export type ThunkClaimAllRewards = {
  claims: Parameters<ClaimHelperAbi['claimMulti']>;
  claimHelper: ClaimHelperAbi;
  merkleDistributorArv: MerkleDistributorAbi;
  merkleDistributorPrv: MerkleDistributorAbi;
  account: string;
};

export const thunkClaimAllRewards = createAsyncThunk(
  THUNKS.CLAIM_REWARDS,
  async (
    {
      claims,
      claimHelper,
      account,
      merkleDistributorArv,
      merkleDistributorPrv,
    }: ThunkClaimAllRewards,
    { rejectWithValue, dispatch },
  ) => {
    if (isEmpty(claims))
      return rejectWithValue('Missing Contract, Account Details or Rewards');

    dispatch(setTxHash(null));
    let tx: ContractTransaction;

    try {
      await merkleDistributorArv.setRewardsDelegate(claimHelper.address);
      await merkleDistributorPrv.setRewardsDelegate(claimHelper.address);
    } catch (e) {
      console.error(e);
      return rejectWithValue('Claim Rewards Failed');
    }

    try {
      await claimHelper.claimMulti(...claims);
    } catch (e) {
      console.error(e);
      return rejectWithValue('Claim Rewards Failed');
    }
    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `claimRewardsPending`,
      id: 'claimRewards',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setShowCompleteModal(true));
      // thunkGetUserRewards({
      //   account,
      //   rewards: merkleTreesByUser[account],
      // });
      return receipt.status;
    }

    return receipt.status !== 1 && rejectWithValue('Claim Rewards Failed');
  },
);
