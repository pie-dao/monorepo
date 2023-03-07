import { Erc20Abi } from '@shared/util-blockchain';
import { getExplorer } from '@shared/util-blockchain/abis';
import { useWeb3React } from '@web3-react/core';
import { BigNumberReference } from '../store/products/products.types';
import { zeroBalance } from '../utils/balances';
import { useAppSelector } from './index';
import { useTokenContract } from './useContracts';
import {
  AVG_SECONDS_IN_MONTH,
  LEVELS_REWARDS,
  MAX_LOCK_DURATION_IN_SECONDS,
} from '../utils/constants';
import { useCallback, useMemo } from 'react';
import { BigNumber, ethers } from 'ethers';
import { formatAsPercent, toBalance } from '../utils/formatBalance';
import { addMonths, getRemainingTimeInMonths } from '../utils/dates';

export const useCurrentChainAddress = (token: string): string => {
  const { chainId } = useWeb3React();
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

export const useUserStakedXAUXO = (): BigNumberReference => {
  return useAppSelector(
    (state) =>
      state.dashboard?.tokens?.xAUXO?.userStakingData?.amount ?? zeroBalance,
  );
};

export const useUserCurrentEpochStakedXAUXO = (): BigNumberReference => {
  return useAppSelector(
    (state) =>
      state.dashboard?.tokens?.xAUXO?.userStakingData?.currentEpochBalance ??
      zeroBalance,
  );
};

export const useDelegatorAddress = (token: string): string => {
  return useAppSelector(
    (state) => state.dashboard?.tokens?.[token]?.userStakingData?.delegator,
  );
};

export const useTokenBalance = (token: string): BigNumberReference => {
  const { chainId } = useWeb3React();
  return useAppSelector(
    (state) =>
      state?.dashboard?.tokens?.[token]?.chainInfo?.[chainId]?.balance ??
      zeroBalance,
  );
};

export const useApprovalLimit = (
  token: string,
  spender: string,
): { limit: BigNumberReference } => {
  /**
   * Determine current amount the vault is approved to spend
   * We can use this to determine whether to allow a deposit, or
   * request a higher limit
   */
  const { chainId } = useWeb3React();
  const limit = useAppSelector(
    (state) =>
      state?.dashboard?.tokens?.[token]?.chainInfo?.[chainId]?.allowance?.[
        spender
      ] ?? zeroBalance,
  );
  if (!limit) return { limit: zeroBalance };
  return { limit };
};

export function useXAUXOEstimation(
  amount: BigNumberReference,
): BigNumberReference {
  const decimals = useDecimals('PRV');
  const fee = useXAUXOFee();
  const estimation = useCallback(() => {
    if (!amount) return zeroBalance;
    if (!fee) return amount;
    const amountBN = BigNumber.from(amount.value);
    if (!amountBN) return zeroBalance;

    return toBalance(amountBN.mul(fee.value).div(100).add(amountBN), decimals);
  }, [amount, fee, decimals]);
  return estimation();
}

export const useXAUXOFee = (): BigNumberReference => {
  const fee = useAppSelector((state) => state.dashboard?.tokens?.xAUXO?.fee);
  return fee;
};

export const useIsFirstTimeMigration = (): boolean => {
  const veAUXOBalance = useTokenBalance('ARV');
  const xAUXOBalance = useTokenBalance('PRV');
  return useMemo(() => {
    return (
      ethers.utils.parseEther(veAUXOBalance.value).isZero() &&
      ethers.utils.parseEther(xAUXOBalance.value).isZero()
    );
  }, [veAUXOBalance, xAUXOBalance]);
};

export const useChainExplorer = () => {
  const { chainId } = useWeb3React();
  return getExplorer(chainId)?.[0];
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
  const hasLock = !!useUserLockDuration('ARV');
  const userLevel = useMemo(() => {
    if (!hasLock) return input - 6;
    if (remainingMonths <= 6) return 0;
    return remainingMonths - 6;
  }, [hasLock, input, remainingMonths]);
  return userLevel;
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
    const percentage = formatAsPercent(
      LEVELS_REWARDS.find((d) => d[0] === input)[1] * 100,
      defaultLocale,
      2,
    );
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
