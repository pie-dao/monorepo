import { useMemo } from 'react';
import { find, isEmpty } from 'lodash';
import { formatBalance, formatBalanceCurrency } from '../utils/formatBalance';
import { vaults as vaultConfig } from '../config/auxoVaults';
import { Vault } from '../store/products/products.types';
import { GetVaultsQuery } from '../api/generated/graphql';

export type VaultData = {
  image: string;
  name: {
    main: string;
    sub: string;
  };
  price: {
    value: string;
  };
  APY: string;
  address: string;
  totalDesposited: string;
  tabs: {
    about: {
      network: string;
      contract: string;
      underlyingAsset: {
        symbol: string;
        contract: string;
      };
    };
    strategies: {
      title: string;
      description: string;
      allocationPercentage: number;
      links: {
        title: string;
        url: string;
      }[];
    }[];
  };
};

export function useFormatDataForSingleVault(
  vaultData: GetVaultsQuery,
  activeVault: Vault,
  currency: string,
  locale: string,
): VaultData {
  const singleVaultData = useMemo(() => {
    const shouldReturn = isEmpty(activeVault);
    if (shouldReturn) return;

    const beData = find(
      vaultData?.vaults,
      (o) => o.address.toLowerCase() === activeVault.address.toLowerCase(),
    );
    const dataFromConfig = find(vaultConfig, (o) => {
      return o.address.toLowerCase() === activeVault.address.toLowerCase();
    });
    return {
      image: dataFromConfig.image,
      name: {
        main: dataFromConfig.name,
        sub: dataFromConfig.symbol,
      },
      price: {
        value: beData?.underlyingToken.marketData[0]?.currentPrice
          ? formatBalanceCurrency(
              beData.underlyingToken.marketData[0].currentPrice,
              locale,
              currency,
              true,
            )
          : null,
      },
      APY: activeVault?.stats?.currentAPY
        ? `${activeVault.stats.currentAPY}%`
        : null,
      address: activeVault?.address ? activeVault.address : null,
      totalDesposited: activeVault?.address
        ? formatBalance(activeVault.stats.deposits.label, locale, 0)
        : null,
      tabs: {
        about: {
          network: dataFromConfig.network.name,
          contract: dataFromConfig.address,
          underlyingAsset: {
            symbol: dataFromConfig.symbol,
            contract: dataFromConfig.token.address,
          },
        },
        strategies: beData?.strategies ? beData.strategies : null,
      },
    };
  }, [activeVault, vaultData, locale, currency]);
  return singleVaultData;
}
