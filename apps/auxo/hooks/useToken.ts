import { Erc20Abi } from '@shared/util-blockchain';
import { getExplorer } from '@shared/util-blockchain/abis';
import { BigNumberReference } from '../store/products/products.types';
import { isZero, subPercentageToBalance, zeroBalance } from '../utils/balances';
import { useAppSelector } from './index';
import { useTokenContract } from './useContracts';
import { useSetChain } from '@web3-onboard/react';
import {
  AVG_SECONDS_IN_DAY,
  AVG_SECONDS_IN_MONTH,
  LEVELS_REWARDS,
  MAX_LOCK_DURATION_IN_SECONDS,
} from '../utils/constants';
import { useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { formatAsPercent } from '../utils/formatBalance';
import { addMonths, getRemainingTimeInMonths } from '../utils/dates';

export const useCurrentChainAddress = (token: string): string => {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useAppSelector(
    (state) => state.dashboard?.tokens?.[token]?.chainInfo?.[chainId]?.address,
  );
};

export const useCurrentTokenContract = (token: string): Erc20Abi => {
  const address = useCurrentChainAddress(token);
  return useTokenContract(address);
};

export const useDecimals = (token: string): number => {
  return useAppSelector(
    (state) => state?.dashboard?.tokens?.[token]?.productDecimals ?? 0,
  );
};

export const useTotalSupply = (token: string): BigNumberReference => {
  return useAppSelector(
    (state) => state.dashboard?.tokens?.[token]?.totalSupply ?? zeroBalance,
  );
};

export const useUserLockDuration = (token: string): number => {
  const lockFromContract = useAppSelector(
    (state) => state?.dashboard?.tokens?.[token]?.userStakingData?.lockDuration,
  );
  return lockFromContract ? lockFromContract / AVG_SECONDS_IN_MONTH : null;
};

export const useUserHasLock = (token: string): boolean | null => {
  const lockFromContract = useAppSelector(
    (state) => state?.dashboard?.tokens?.[token]?.userStakingData?.lockDuration,
  );

  return useMemo(() => {
    if (!lockFromContract) {
      return null;
    }
    return lockFromContract > 0;
  }, [lockFromContract]);
};

export const useIsUserMaxLockDuration = (token: string): boolean | null => {
  const lockFromContract = useAppSelector(
    (state) => state?.dashboard?.tokens?.[token]?.userStakingData?.lockDuration,
  );

  return useMemo(() => {
    if (!lockFromContract) {
      return null;
    }
    return lockFromContract === MAX_LOCK_DURATION_IN_SECONDS;
  }, [lockFromContract]);
};

export const useUserLockDurationInSeconds = (token: string): number => {
  const lockFromContract = useAppSelector(
    (state) => state?.dashboard?.tokens?.[token]?.userStakingData?.lockDuration,
  );
  return lockFromContract ? lockFromContract : null;
};

export const useUserLockStartingTime = (token: string): number => {
  const lockFromContract = useAppSelector(
    (state) => state?.dashboard?.tokens?.[token]?.userStakingData?.lockedAt,
  );
  return lockFromContract ? lockFromContract : null;
};

export const useUserLockAmount = (token: string): BigNumberReference => {
  return useAppSelector(
    (state) =>
      state.dashboard?.tokens?.[token]?.userStakingData?.amount ?? zeroBalance,
  );
};

export const useUserVotingPower = (token: string): BigNumberReference => {
  return useAppSelector(
    (state) =>
      state.dashboard?.tokens?.[token]?.userStakingData?.votingPower ??
      zeroBalance,
  );
};

export const useUserStakedPRV = (): BigNumberReference => {
  return useAppSelector(
    (state) =>
      state.dashboard?.tokens?.PRV?.userStakingData?.amount ?? zeroBalance,
  );
};

export const useUserCurrentEpochStakedPRV = (): BigNumberReference => {
  return useAppSelector(
    (state) =>
      state.dashboard?.tokens?.PRV?.userStakingData?.currentEpochBalance ??
      zeroBalance,
  );
};

export const useUserPendingBalancePRV = (): BigNumberReference => {
  return useAppSelector(
    (state) =>
      state.dashboard?.tokens?.PRV?.userStakingData?.pendingBalance ??
      zeroBalance,
  );
};

export const useDelegatorAddress = (token: string): string => {
  return useAppSelector(
    (state) => state.dashboard?.tokens?.[token]?.userStakingData?.delegator,
  );
};

export const useTokenBalance = (token: string): BigNumberReference => {
  const [{ connectedChain }] = useSetChain();
  const chainId = Number(connectedChain?.id);
  return useAppSelector(
    (state) =>
      state?.dashboard?.tokens?.[token]?.chainInfo?.[chainId]?.balance ??
      zeroBalance,
  );
};

export const useApprovalLimit = (
  token: string,
  spender: string,
): BigNumberReference => {
  /**
   * Determine current amount the vault is approved to spend
   * We can use this to determine whether to allow a deposit, or
   * request a higher limit
   */
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  const limit = useAppSelector(
    (state) =>
      state?.dashboard?.tokens?.[token]?.chainInfo?.[chainId]?.allowance?.[
        spender
      ] ?? zeroBalance,
  );
  if (!limit) return zeroBalance;
  return limit;
};

export function usePRVEstimation(
  amount: BigNumberReference,
  subtractedValue = false,
): {
  value: BigNumberReference;
  subtractedValue: BigNumberReference;
} {
  const decimals = useDecimals('PRV');
  const fee = usePRVFee();
  const estimation = useCallback(() => {
    const zero = {
      value: zeroBalance,
      subtractedValue: zeroBalance,
    };
    if (isZero(amount, decimals) || !amount) return zero;
    if (isZero(fee, decimals))
      return {
        value: amount,
        subtractedValue: zeroBalance,
      };
    return subPercentageToBalance(amount, fee, decimals, subtractedValue);
  }, [amount, decimals, fee, subtractedValue]);
  return estimation();
}

export const usePRVFee = (): BigNumberReference => {
  const fee = useAppSelector((state) => state.dashboard?.tokens?.PRV?.fee);
  return fee;
};

export const useIsFirstTimeMigration = (): boolean => {
  const ARVBalance = useTokenBalance('ARV');
  const PRVBalance = useTokenBalance('PRV');
  return useMemo(() => {
    return (
      ethers.utils.parseEther(ARVBalance.value).isZero() &&
      ethers.utils.parseEther(PRVBalance.value).isZero()
    );
  }, [ARVBalance, PRVBalance]);
};

export const useChainExplorer = () => {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return getExplorer(Number(chainId))?.[0];
};

export const useUserRemainingStakingTimeInMonths = () => {
  const lockDuration = useUserLockDurationInSeconds('ARV');
  const lockStartingTime = useUserLockStartingTime('ARV');
  const remainingTime = useMemo(() => {
    if (!lockDuration || !lockStartingTime) return null;
    const remainingMonths = getRemainingTimeInMonths(
      lockDuration,
      lockStartingTime,
    );
    return remainingMonths;
  }, [lockDuration, lockStartingTime]);
  return remainingTime;
};

export const UseIsUserLosingLevel = () => {
  const stakedAt = useUserLockStartingTime('ARV');

  const isLosingLevel = useMemo(() => {
    if (!stakedAt) return null;

    const currentDate = new Date().getTime() / 1000;
    const diffTime = currentDate - stakedAt;

    // Calculate the day in the current cycle in seconds
    const timeInCurrentCycle = diffTime % AVG_SECONDS_IN_MONTH;

    // check if timeInCurrentCycle is between 25 days and 30 days (i.e., the last 5 days)
    return (
      timeInCurrentCycle >= AVG_SECONDS_IN_MONTH - 5 * AVG_SECONDS_IN_DAY &&
      timeInCurrentCycle <= AVG_SECONDS_IN_MONTH
    );
  }, [stakedAt]);

  return isLosingLevel;
};

export const useCheckUserIsMaxBoosted = () => {
  const remainingMonths = useUserRemainingStakingTimeInMonths();
  const isMaxBoosted = useMemo(() => {
    if (remainingMonths === null) return null;
    return remainingMonths === 36;
  }, [remainingMonths]);
  return isMaxBoosted;
};

export const useUserEndDate = () => {
  const userLockStartingTime = useUserLockStartingTime('ARV');
  const userLockDuration = useUserLockDurationInSeconds('ARV');
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  return useMemo(() => {
    if (!userLockStartingTime || !userLockDuration) {
      return;
    }
    return new Date(
      (userLockStartingTime + userLockDuration) * 1000,
    ).toLocaleDateString(defaultLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }, [userLockStartingTime, userLockDuration, defaultLocale]);
};

export const useUserNewEndDateFromToday = (stakingTime?: number) => {
  const userLockDuration = useUserLockDurationInSeconds('ARV');
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  return useMemo(() => {
    if (!userLockDuration && stakingTime) {
      return addMonths(stakingTime, new Date()).toLocaleDateString(
        defaultLocale,
        {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        },
      );
    }
    return new Date(
      (Date.now() / 1000 + userLockDuration) * 1000,
    ).toLocaleDateString(defaultLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }, [userLockDuration, stakingTime, defaultLocale]);
};

export const useUserLevel = (input: number) => {
  const remainingMonths = useUserRemainingStakingTimeInMonths();
  const hasLock = useUserHasLock('ARV');
  const userLevel = useMemo(() => {
    if (!input) return;
    if (!hasLock) return input - 6;
    if (remainingMonths <= 6) return 0;
    if (remainingMonths > 36) return 30;
    return remainingMonths - 6;
  }, [hasLock, input, remainingMonths]);
  return userLevel;
};

export const useMonthsSinceStake = () => {
  const userLockStartingTime = useUserLockStartingTime('ARV');
  const monthsSinceStake = useMemo(() => {
    if (!userLockStartingTime) return null;
    return getRemainingTimeInMonths(userLockStartingTime, Date.now() / 1000);
  }, [userLockStartingTime]);
  return monthsSinceStake;
};

export const useUserIncreasedLevel = (input: number) => {
  const remainingMonths = useUserRemainingStakingTimeInMonths();
  const sum = useMemo(() => remainingMonths + input, [input, remainingMonths]);
  return useMemo(() => {
    if (sum <= 6) return 0;
    return sum - 6;
  }, [sum]);
};

export const useUserLevelPercetageReward = (input: number) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const percentageReward = useMemo(() => {
    const findLevel = LEVELS_REWARDS?.find((d) => d[0] === input);
    if (!findLevel) return '0%';
    const percentage = formatAsPercent(findLevel[1] * 100, defaultLocale, 2);
    return percentage;
  }, [defaultLocale, input]);
  return percentageReward;
};

export const useIsUserLockExpired = () => {
  const remainingMonths = useUserRemainingStakingTimeInMonths();
  return useMemo(() => {
    if (remainingMonths === null) return null;
    return remainingMonths <= 0;
  }, [remainingMonths]);
};

export const useUserPassedMonthsLock = () => {
  const monthsAtLock = useUserLockDuration('ARV');
  const startingAtLock = useUserLockStartingTime('ARV');
  const passedMonths = useMemo(() => {
    if (!monthsAtLock || !startingAtLock) return null;
    return getPassedMonths(monthsAtLock, startingAtLock);
  }, [monthsAtLock, startingAtLock]);
  return passedMonths;
};

const getPassedMonths = (monthsAtLock: number, startingAtLock: number) => {
  const passedMonths = Math.ceil(
    (Date.now() / 1000 - startingAtLock) / monthsAtLock,
  );
  return passedMonths;
};

export const useEarlyTerminationFee = () => {
  return useAppSelector(
    (state) => state.dashboard?.tokens?.ARV?.earlyTerminationFee ?? zeroBalance,
  );
};

export const useUserPrvClaimableAmount = () => {
  return useAppSelector(
    (state) =>
      state.dashboard?.tokens?.PRV?.userStakingData?.claimableAmount ??
      zeroBalance,
  );
};

export const useCurrentPrvWithdrawalAmount = () => {
  return useAppSelector(
    (state) =>
      state.dashboard?.tokens?.PRV?.currentWithdrawalAmount ?? zeroBalance,
  );
};

export const useIsAutoCompoundEnabled = (token: 'ARV' | 'PRV') => {
  return useAppSelector(
    (state) => state.rewards?.data?.metadata?.[token]?.isCompound ?? false,
  );
};
