import { useEffect, useMemo } from 'react';
import {
  useLazyGetVaultsQuery,
  UserYieldVaultEntity,
} from '../api/generated/graphql';
import { formatBalance, formatBalanceCurrency } from '../utils/formatBalance';
import { vaults as vaultConfig } from '../config/auxoVaults';
import { ethers } from 'ethers';
import { Vaults } from '../store/products/products.types';
import { find, isEmpty } from 'lodash';

export type VaultTableData = {
  image: string;
  name: {
    main: string;
    sub: string;
  };
  price: {
    value: string;
  };
  APY: string;
  balance: string;
  portfolioPercentage: string;
  value: string;
  subRow: {
    userDeposited: string;
    userEarnings: string;
    userEarningsTwentyFourHours: string;
    totalDesposited: string;
  };
};

type TableStatus = {
  isLoading: boolean;
  isError: boolean;
  formattedVaults: VaultTableData[];
};

export function useFormatDataForVaultsTable(
  vaults: Vaults,
  userVaults: UserYieldVaultEntity[],
  totalBalance: number,
  currency: string,
  locale: string,
): TableStatus {
  const [trigger, { isLoading, isError, data: vaultsData }] =
    useLazyGetVaultsQuery();

  const filteredVaults = useMemo(() => {
    const filteredVaults = Object.values(vaults).filter(
      (vault) => vault.balance && vault.balance !== '0',
    );
    return filteredVaults;
  }, [vaults]);

  useEffect(() => {
    if (
      !isEmpty(filteredVaults) &&
      !isEmpty(filteredVaults[0].symbol) &&
      !isEmpty(currency)
    ) {
      trigger({
        currency,
      });
    }
  }, [currency, vaults, trigger, filteredVaults]);

  const formattedVaults = useMemo(() => {
    const shouldReturn =
      isLoading ||
      isError ||
      isEmpty(filteredVaults) ||
      isEmpty(vaultsData?.vaults) ||
      isEmpty(currency) ||
      isEmpty(userVaults);

    if (shouldReturn) return;

    const ordervaults = filteredVaults.map((value) => {
      const vault = find(vaults, { address: value.address });
      const { address } = value;
      const dataFromConfig = find(vaultConfig, (o) => {
        return o.address.toLowerCase() === address.toLowerCase();
      });
      const beData = find(
        vaultsData.vaults,
        (o) => o.address.toLowerCase() === address.toLowerCase(),
      );
      return {
        image: dataFromConfig.image,
        name: {
          main: dataFromConfig.name,
          sub: dataFromConfig.symbol,
        },
        price: {
          value: formatBalanceCurrency(
            beData.underlyingToken.marketData[0].currentPrice,
            locale,
            currency,
          ),
        },
        APY: `${vault.estimatedReturn}%`,
        portfolioPercentage: `${(
          (+ethers.utils.formatUnits(vault.balance, vault.decimals) /
            Number(totalBalance)) *
          100
        ).toFixed()}%`,
        balance: Number(
          ethers.utils.formatUnits(vault.balance, vault.decimals),
        ).toFixed(2),
        value: formatBalanceCurrency(
          Number(
            beData.underlyingToken.marketData[0].currentPrice *
              Number(ethers.utils.formatUnits(vault.balance, vault.decimals)),
          ),
          locale,
          currency,
        ),
        subRow: {
          userDeposited: Number(
            ethers.utils.formatUnits(vault.balance, vault.decimals),
          ).toFixed(2),
          userEarnings: formatBalance(
            find(userVaults, (o) => {
              return o.address.toLowerCase() === address.toLowerCase();
            })?.totalEarnings || 0,
            locale,
            0,
          ),
          userEarningsTwentyFourHours: formatBalance(
            find(userVaults, (o) => {
              return o.address.toLowerCase() === address.toLowerCase();
            })?.twentyFourHourEarnings || 0,
            locale,
            0,
          ),
          totalDesposited: formatBalance(vault.totalDeposited, locale, 0),
        },
      };
    });
    return ordervaults;
  }, [
    isLoading,
    isError,
    filteredVaults,
    vaultsData?.vaults,
    currency,
    userVaults,
    locale,
    vaults,
    totalBalance,
  ]);
  return { formattedVaults, isLoading, isError };
}
