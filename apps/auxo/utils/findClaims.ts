import { isEqual } from 'lodash';
import { Data, Month } from '../store/rewards/rewards.types';

export type MonthWithAccount = Month & {
  account: string;
};

export function findMonthsByProof(
  proof: string[],
  rewardPositions: Data['rewardPositions'],
  account: string,
) {
  const monthMap = new Map<string, MonthWithAccount[]>();
  Object.entries(rewardPositions).forEach(([key, months]) => {
    const matches = months
      ?.filter((month) => isEqual(month?.proof, proof) && !month.monthClaimed)
      ?.map((month) => ({ ...month, account }));
    monthMap.set(key, matches);
  });
  const matches = Object.fromEntries(monthMap);
  return matches;
}
