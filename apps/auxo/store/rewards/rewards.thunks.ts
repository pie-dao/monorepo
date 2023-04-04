import { ContractTransaction, ethers } from 'ethers';
import { isEmpty } from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toBalance } from '../../utils/formatBalance';
import { UserMerkleTree } from '../../types/merkleTree';
import { merkleDistributorContract } from '../products/products.contracts';
import { MerkleDistributorAbi, ClaimHelperAbi } from '@shared/util-blockchain';
import {
  setTxHash,
  setShowCompleteModal,
  setTotalClaiming,
} from '../rewards/rewards.slice';
import { pendingNotification } from '../../components/Notifications/Notifications';
import { addBalances, zeroBalance } from '../../utils/balances';
import { Month, Data } from './rewards.types';
import merkleTreesByUser from '../../config/merkleTreesByUser.json';

export const THUNKS = {
  GET_USER_REWARDS: 'rewards/getUserRewards',
  CLAIM_REWARDS: 'rewards/claimRewards',
};

export type ThunkClaimRewards = {
  claim:
    | Parameters<MerkleDistributorAbi['claim']>[0]
    | Parameters<MerkleDistributorAbi['claimMulti']>[0];
  merkleDistributor: MerkleDistributorAbi;
  isSingleClaim: boolean;
  token?: string;
  account: string;
};

export const thunkClaimRewards = createAsyncThunk(
  THUNKS.CLAIM_REWARDS,
  async (
    { isSingleClaim, claim, merkleDistributor, account }: ThunkClaimRewards,
    { rejectWithValue, dispatch },
  ) => {
    if (isEmpty(claim))
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
          rewards: merkleTreesByUser[account],
        }),
      );
      return receipt.status;
    }

    return receipt.status !== 1 && rejectWithValue('Claim Rewards Failed');
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
        const results: Month[][] = await Promise.all(
          Object.entries(rewards).map(([token, recipient]) => {
            return Promise.all(
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
          }),
        );

        return results;
      };

      const results = await allMonthsPromisify();

      const data: Data = {
        rewardPositions: {
          ARV: results[0],
          PRV: results[1],
        },
        metadata: {
          ARV: results[0]
            .filter((value) => !value.monthClaimed)
            .reduce((acc, curr) => {
              return addBalances(acc, curr.rewards);
            }, zeroBalance),
          PRV: results[1]
            .filter((value) => !value.monthClaimed)
            .reduce((acc, curr) => {
              return addBalances(acc, curr.rewards);
            }, zeroBalance),
          total: addBalances(
            results[0]
              .filter((value) => !value.monthClaimed)
              .reduce((acc, curr) => {
                return addBalances(acc, curr.rewards);
              }, zeroBalance),
            results[1]
              .filter((value) => !value.monthClaimed)
              .reduce((acc, curr) => {
                return addBalances(acc, curr.rewards);
              }, zeroBalance),
          ),
          allTimeTotal: addBalances(
            results[0].reduce((acc, curr) => {
              return addBalances(acc, curr.rewards);
            }, zeroBalance),
            results[1].reduce((acc, curr) => {
              return addBalances(acc, curr.rewards);
            }, zeroBalance),
          ),
        },
      };

      return data;
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
    console.log(claimHelper);

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
      thunkGetUserRewards({
        account,
        rewards: merkleTreesByUser[account],
      });
      return receipt.status;
    }

    return receipt.status !== 1 && rejectWithValue('Claim Rewards Failed');
  },
);
