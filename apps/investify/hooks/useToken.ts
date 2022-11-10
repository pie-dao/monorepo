import { Erc20Abi } from '@shared/util-blockchain';
import { useWeb3React } from '@web3-react/core';
import { BigNumberReference } from '../store/products/products.types';
import { zeroBalance } from '../utils/balances';
import { useAppSelector } from './index';
import { useTokenContract } from './useContracts';

export const useCurrentChainAddress = (token: string): string => {
  const { chainId } = useWeb3React();
  return useAppSelector((state) => state.dashboard[token]?.[chainId]?.address);
};

export const useCurrentTokenContract = (token: string): Erc20Abi => {
  const address = useCurrentChainAddress(token);
  return useTokenContract(address);
};

export const useDecimals = (token: string): number => {
  return useAppSelector(
    (state) => state?.dashboard?.tokens[token]?.productDecimals ?? 0,
  );
};

export const useTokenBalance = (token: string): BigNumberReference => {
  const { chainId } = useWeb3React();
  return useAppSelector(
    (state) =>
      state?.dashboard?.tokens[token]?.chainInfo[chainId]?.balance ??
      zeroBalance,
  );
};

export const useApprovalLimit = (
  token: string,
): { limit: BigNumberReference } => {
  /**
   * Determine current amount the vault is approved to spend
   * We can use this to determine whether to allow a deposit, or
   * request a higher limit
   */
  const { chainId } = useWeb3React();
  const limit = useAppSelector(
    (state) =>
      state?.dashboard?.tokens[token]?.chainInfo[chainId]?.allowance ??
      zeroBalance,
  );
  if (!limit) return { limit: zeroBalance };
  return { limit };
};
