import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import useTranslation from 'next-translate/useTranslation';
import { isEmpty } from 'lodash';
import { useAppSelector } from '../../hooks';
import {
  useFormatDataForAssetsTable,
  ProductTableData,
} from '../../hooks/useFormatDataForAssetsTable';
import {
  useFormatDataForVaultsTable,
  VaultTableData,
} from '../../hooks/useFormatDataForVaults';
import ProductTable from './ProductTable';
import VaultTable from './VaultTable';
import { useFindUserQuery } from '../../api/generated/graphql';

export default function DashboardTable() {
  const { t } = useTranslation();
  const { dashboard, preferences } = useAppSelector((state) => state);
  const { account } = useWeb3React();
  const { data } = useFindUserQuery({ address: account });
  const { loading: dashboardLoading } = dashboard;
  const { formattedProducts } = useFormatDataForAssetsTable(
    dashboard?.tokens,
    dashboard?.stats?.balance?.total,
    preferences?.defaultCurrency,
    preferences?.defaultLocale,
  );

  const { formattedVaults } = useFormatDataForVaultsTable(
    dashboard.vaults,
    data?.user?.yieldVaults,
    dashboard?.stats?.balance?.total,
    preferences.defaultCurrency,
    preferences.defaultLocale,
  );

  useEffect(() => {
    if (formattedProducts) {
      setProductData(formattedProducts);
    }
  }, [formattedProducts]);

  useEffect(() => {
    if (formattedVaults) {
      setVaultData(formattedVaults);
    }
  }, [formattedVaults]);

  const [vaultData, setVaultData] = useState<VaultTableData[]>(null);
  const [productData, setProductData] = useState<ProductTableData[]>(null);
  return (
    <>
      {dashboardLoading && <div className="mt-1">Loading...</div>}
      {!isEmpty(vaultData || productData) && (
        <div className="gap-y-5 w-full flex flex-col space-between mt-8 px-3">
          <div className="hidden items-center sm:flex">
            <div className="min-w-0 flex-1 flex items-start px-3">
              <div className="flex-shrink-0 w-[40px]"></div>
              <div className="min-w-0 flex-1 px-4 sm:grid sm:grid-cols-4 sm:gap-4 ">
                <div className="flex flex-col justify-between">
                  <p className="text-xs">{t('dashboard:name')}</p>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-xs">{t('dashboard:price')}</p>
                </div>
                <div className="flex flex-col justify-center text-right">
                  <p className="text-xs text-sub-dark">
                    {t('dashboard:balance')}
                  </p>
                </div>
                <div className="flex flex-col justify-center text-right">
                  <p className="text-xs text-primary">{t('dashboard:value')}</p>
                </div>
              </div>
            </div>
            <div className="h-5 w-5"></div>
          </div>
          {!isEmpty(productData) &&
            productData.map((product) => (
              <ProductTable key={product.name.main} product={product} />
            ))}
          {!isEmpty(vaultData) &&
            vaultData.map((vault) => (
              <VaultTable key={vault.name.main} vault={vault} />
            ))}
        </div>
      )}
    </>
  );
}
