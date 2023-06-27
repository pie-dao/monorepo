import poolsConfig from '../config/lendingPools.json';
import { TypesMap } from '../types/cmsTypes';
import { useStrapiCollection } from './useTreasury';
import { useAppSelector } from '.';
import { Pool } from '../store/lending/lending.types';
import { useMemo } from 'react';

export type userMergedPosition = TypesMap['pools']['data'][0] & Pool;

type AddressInput = string | string[] | undefined;
type EnhancedPoolsReturnType = {
  data: userMergedPosition[] | null;
  isLoading: boolean;
  isError: boolean;
};

type SingleEnhancedPoolReturnType = {
  data: userMergedPosition | null;
  isLoading: boolean;
  isError: boolean;
};

export const UseOnChainPoolData = (address: string | string[]) => {
  const poolAddressesContracts = useMemo(() => {
    return Array.isArray(address) ? address : [address];
  }, [address]);
  const allPools = useAppSelector((state) => state.lending.pools);

  const filteredPools = useMemo(() => {
    return Object.fromEntries(
      Object.entries(allPools).filter(([key]) =>
        poolAddressesContracts.includes(key),
      ),
    );
  }, [allPools, poolAddressesContracts]);

  return filteredPools;
};

export function useEnanchedPools(): EnhancedPoolsReturnType;
export function useEnanchedPools(address: string): SingleEnhancedPoolReturnType;
export function useEnanchedPools(address: string[]): EnhancedPoolsReturnType;
export function useEnanchedPools(address?: AddressInput) {
  const filterAddresses = Array.isArray(address)
    ? address
    : address
    ? [address]
    : poolsConfig;

  const { data, ...rest } = useStrapiCollection<TypesMap['pools']>('pools', {
    populate: 'deep,3',
    filters: {
      address: {
        $in: filterAddresses,
      },
    },
  });

  const poolData = UseOnChainPoolData(filterAddresses);

  const mergedData = Object.entries(poolData)
    .map(([address, onChainData]) => {
      const cmsPool = data?.data?.find(
        (pool) => pool.attributes?.address === address,
      );

      if (cmsPool) {
        const mergedObj = Object.assign({}, cmsPool, onChainData);
        return mergedObj;
      }
      return null;
    })
    .filter(Boolean);

  const userPositionData =
    Array.isArray(address) || address === undefined
      ? mergedData
      : mergedData[0] || null;

  return {
    data: userPositionData,
    isError: rest.isError,
    isLoading: rest.isLoading,
  };
}
