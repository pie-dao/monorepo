import { useAppSelector } from '.';
import { BigNumberReference } from '../store/products/products.types';
import {
  calculatePriceInUSD,
  compareBalances,
  zeroBalance,
} from '../utils/balances';
import { findProductByAddress } from '../utils/findProductByAddress';
import { useCoinGeckoTokenPrice } from './useCoingecko';

export const useUserPoolBalanceInUSD = (address: string) => {
  const pool = useAppSelector((state) => state?.lending?.pools?.[address]);
  const princpalAddress = pool?.principal;
  const userAmount = pool?.userData?.balance;
  const principalDecimals = findProductByAddress(princpalAddress).decimals;
  const { data, isError, isLoading } = useCoinGeckoTokenPrice(
    princpalAddress,
    'usd',
  );

  const usdPrice = calculatePriceInUSD(
    userAmount,
    principalDecimals,
    isError || isLoading ? 1 : (data as number),
  );

  return {
    data: usdPrice,
    isError,
    isLoading,
  };
};

export const UseMaxWithdrawableAmountFromPool = (poolAddress: string) => {
  return useAppSelector(
    (state) =>
      state?.lending?.pools?.[poolAddress]?.userData?.unlendableAmount ??
      zeroBalance,
  );
};

export const UseCanUserWithdrawFromPool = (poolAddress: string) => {
  return useAppSelector(
    (state) => state?.lending?.pools?.[poolAddress]?.userData?.canWithdraw,
  );
};

export const UseUserCanClaim = (poolAddress: string) => {
  return useAppSelector(
    (state) => state?.lending?.pools?.[poolAddress]?.userData?.canClaim,
  );
};

export const UseUserCanCompound = (poolAddress: string) => {
  return useAppSelector(
    (state) => state?.lending?.pools?.[poolAddress]?.userData?.canCompound,
  );
};

export const UseUserPreference = (poolAddress: string) => {
  return useAppSelector(
    (state) => state?.lending?.pools?.[poolAddress]?.userData?.preference,
  );
};

export const UseMaxEpochCapacityFromPool = (poolAddress: string) => {
  return useAppSelector(
    (state) =>
      state?.lending?.pools?.[poolAddress]?.epochCapacity ?? zeroBalance,
  );
};

export const UsePoolState = (poolAddress: string) => {
  return useAppSelector(
    (state) => state?.lending?.pools?.[poolAddress]?.lastEpoch?.state,
  );
};

export const UsePoolApproval = (poolAddress: string): BigNumberReference => {
  return useAppSelector(
    (state) =>
      state?.lending?.pools?.[poolAddress]?.userData?.allowance ?? zeroBalance,
  );
};

export const UseLoan = (poolAddress: string) => {
  return useAppSelector(
    (state) =>
      state?.lending?.pools?.[poolAddress]?.userData?.balance ?? zeroBalance,
  );
};

export const UsePoolAcceptsDeposits = (poolAddress: string): boolean =>
  useAppSelector((state) => state?.lending?.pools?.[poolAddress]?.canDeposit);

export const UseSufficentApproval = (poolAddress: string): boolean => {
  const allowance = UsePoolApproval(poolAddress);
  return compareBalances(allowance, 'gt', zeroBalance);
};
