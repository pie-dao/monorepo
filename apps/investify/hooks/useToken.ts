import { Erc20Abi } from '@shared/util-blockchain';
import { useWeb3React } from '@web3-react/core';
import { BigNumberReference } from '../store/products/products.types';
import { zeroBalance } from '../utils/balances';
import { useAppSelector } from './index';
import { useTokenContract } from './useContracts';
import { AVG_SECONDS_IN_MONTH } from '../utils/constants';
import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import { toBalance } from '../utils/formatBalance';

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
  const decimals = useDecimals('xAUXO');
  const fee = useXAUXOFee();
  const estimation = useCallback(() => {
    if (!amount) return zeroBalance;
    if (!fee) return amount;
    const amountBN = BigNumber.from(amount.value);

    return toBalance(amountBN.mul(fee.value).div(100).add(amountBN), decimals);
  }, [amount, fee, decimals]);
  return estimation();
}

export const useXAUXOFee = (): BigNumberReference => {
  const fee = useAppSelector((state) => state.dashboard?.tokens?.xAUXO?.fee);
  return fee;
};
