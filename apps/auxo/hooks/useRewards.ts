import { useAppSelector } from '.';
import { Month } from '../store/rewards/rewards.types';
import { WritableDraft } from 'immer/dist/internal';
import { isEmpty } from 'lodash';

type Token = 'PRV' | 'ARV' | 'AUXO';

export const useTotalActiveRewards = () => {
  const { data } = useAppSelector((state) => state?.rewards);
  return data?.metadata?.total;
};

export const useActiveRewards = (token: Token) => {
  const { data } = useAppSelector((state) => state?.rewards);
  return data?.metadata?.[token];
};

export const useHasActiveClaimDissolution = () => {
  const { dissolution } = useAppSelector((state) => state?.rewards);
  return dissolution?.some((d) => !d.monthClaimed);
};

export const useActiveClaimDissolution = () => {
  const { dissolution } = useAppSelector((state) => state?.rewards);
  return dissolution?.filter((d) => !d.monthClaimed);
};

export const useLatestUnclaimedRewards = (token: Token) => {
  const { data } = useAppSelector((state) => state?.rewards);
  const rewardPosition = data?.rewardPositions?.[token];
  if (isEmpty(rewardPosition)) {
    return null;
  }
  const latestUnclaimedReward = [...rewardPosition]
    ?.sort((a, b) => {
      return b.windowIndex - a.windowIndex;
    })
    ?.find((r) => !r.monthClaimed);
  return latestUnclaimedReward;
};

export const useSingleRewardList = (token: Token): WritableDraft<Month>[] => {
  const { data } = useAppSelector((state) => state?.rewards);
  const rewardPosition = data?.rewardPositions?.[token];
  if (!rewardPosition) {
    throw new Error(`No reward position for token ${token}`);
  }
  return rewardPosition;
};

export const useClaimedRewards = () => {
  const { data } = useAppSelector((state) => state?.rewards);
  if (
    isEmpty(data?.rewardPositions?.ARV) &&
    isEmpty(data?.rewardPositions?.PRV)
  ) {
    return data?.rewardPositions;
  }

  return Object.assign(
    {},
    { ARV: data?.rewardPositions?.ARV?.filter((r) => r.monthClaimed) },
    { PRV: data?.rewardPositions?.PRV?.filter((r) => r.monthClaimed) },
  );
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
