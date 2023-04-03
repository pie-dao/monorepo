import { useAppSelector } from '.';
import { Month } from '../store/rewards/rewards.types';
import { WritableDraft } from 'immer/dist/internal';

type Token = 'PRV' | 'ARV';

export const useTotalActiveRewards = () => {
  const { data } = useAppSelector((state) => state?.rewards);
  return data?.metadata?.total;
};

export const useActiveRewards = (token: Token) => {
  const { data } = useAppSelector((state) => state?.rewards);
  return data?.metadata?.[token];
};

export const useSingleRewardList = (token: Token): WritableDraft<Month>[] => {
  const { data } = useAppSelector((state) => state?.rewards);
  const rewardPosition = data?.rewardPositions?.[token];
  if (!rewardPosition) {
    throw new Error(`No reward position for token ${token}`);
  }
  return rewardPosition;
};

export const useClaimedRewards = (token?: Token | Token[]) => {
  const { data } = useAppSelector((state) => state?.rewards);
  if (!token) {
    return data?.rewardPositions;
  }
  if (Array.isArray(token)) {
    return token.map((t) => {
      const rewardPosition = data?.rewardPositions?.[t];
      if (!rewardPosition) {
        throw new Error(`No reward position for token ${t}`);
      }
      return rewardPosition.filter((r) => r.monthClaimed);
    });
  }

  return data?.rewardPositions?.[token].filter((r) => r.monthClaimed);
};

export const useUnclaimedRewards = (token: Token) => {
  const { data } = useAppSelector((state) => state?.rewards);
  return data?.rewardPositions?.[token]?.filter((r) => !r.monthClaimed);
};

export const useAllUnclaimedRewards = () => {
  const { data } = useAppSelector((state) => state?.rewards);
  return {
    PRV: data?.rewardPositions?.PRV?.filter((r) => !r.monthClaimed),
    ARV: data?.rewardPositions?.ARV?.filter((r) => !r.monthClaimed),
  };
};
