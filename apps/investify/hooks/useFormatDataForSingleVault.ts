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
      content: string;
      network: string;
      contract: string;
      underlyingAsset: {
        symbol: string;
        contract: string;
      };
    };
    strategyDetails: {
      title: string;
      content: string;
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
    const shouldReturn = isEmpty(activeVault) || isEmpty(vaultData);
    if (shouldReturn) return;

    const beData = find(
      vaultData.vaults,
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
        value: formatBalanceCurrency(
          beData.underlyingToken.marketData[0].currentPrice,
          locale,
          currency,
          true,
        ),
      },
      APY: `${activeVault.stats.currentAPY}%`,
      address: activeVault.address,
      totalDesposited: formatBalance(
        activeVault.stats.deposits.label,
        locale,
        0,
      ),
      tabs: {
        about: {
          content: 'My awesome content',
          network: 'Fantom',
          contract: '0x0',
          underlyingAsset: {
            symbol: 'DAI',
            contract: '',
          },
        },
        strategyDetails: [
          {
            title: 'Lorem ipsum dolor sit amet',
            content: 'Lorem ipsum dolor sit amet',
            links: [
              {
                title: 'lorem ipsum',
                url: 'https://www.google.com',
              },
              {
                title: 'lorem ipsum',
                url: 'https://www.google.com',
              },
            ],
          },
          {
            title: 'Lorem Ipsum Dolor Sit Amet',
            content: 'lorem ipsum dolor sit amet',
            links: [
              {
                title: 'lorem ipsum',
                url: 'https://www.google.com',
              },
              {
                title: 'lorem ipsum',
                url: 'https://www.google.com',
              },
            ],
          },
        ],
      },
    };
  }, [activeVault, vaultData, locale, currency]);
  return singleVaultData;
}
