import useTranslation from 'next-translate/useTranslation';
import { ReactElement } from 'react';
import Image from 'next/image';
import { Layout } from '../components';
import AuxoIcon from '../public/images/auxoIcon.svg';
import { MetamaskIcon } from '@shared/ui-library';
import addTokenToWallet from '../utils/addTokenToWallet';
import {
  formatAsPercent,
  formatBalance,
  formatBalanceCurrency,
} from '../utils/formatBalance';
import { useAppSelector } from '../hooks';
import Tooltip from '../components/Tooltip/Tooltip';
import { TreasuryTabs } from '../components/TreasuryTable';
import { useGetTreasuryQuery } from '../api/generated/graphql';
import {
  BaseSubDarkTextSkeleton,
  BoldSubDarkTextSkeleton,
  BoxLoading,
} from '../components/Skeleton';
import PositionsTabs from '../components/Positions';
import { useWeb3React } from '@web3-react/core';
import { wrapper } from '../store';

export default function Treasury(): ReactElement {
  const { defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );

  const { data, isLoading, isError } = useGetTreasuryQuery({
    currency: defaultCurrency,
  });

  const { t } = useTranslation();
  const { chainId } = useWeb3React();

  return (
    <>
      <div className="flex flex-col">
        <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap px-4 md:px-10">
          <div className="flex flex-1 items-center gap-x-2 bg-gradient-primary rounded-full shadow-card self-center w-full xl:w-auto p-2 md:p-0">
            <Image src={AuxoIcon} alt={'Auxo Icon'} width={32} height={32} />
            <h2
              className="text-lg font-medium text-primary w-fit"
              data-cy="product-name"
            >
              AUXO
            </h2>
            <button
              className="flex ml-auto pr-2"
              onClick={async () => await addTokenToWallet(chainId, 'AUXO')}
            >
              <div className="flex gap-x-2 items-center">
                <div className="hidden sm:flex gap-x-1">
                  <span className="text-sub-dark underline text-sm hover:text-sub-light">
                    {t('addTokenToWallet', {
                      token: `AUXO`,
                    })}
                  </span>
                </div>
                <MetamaskIcon className="h-5 w-5" />
              </div>
            </button>
          </div>
        </section>

        {/* Section for TVL, Capital Utilization, and APY */}
        <section className="flex flex-wrap justify-between gap-4 px-4 md:px-10 text-xs md:text-inherit mt-6">
          <div className="grid grid-cols-3 gap-x-4">
            <div className="flex flex-col py-1">
              {isLoading ? (
                <>
                  <BoldSubDarkTextSkeleton />
                  <BaseSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-bold text-sub-dark sm:text-xl">
                    {isError || !data?.getTreasury?.marketData?.tvl
                      ? 'N/A'
                      : formatBalanceCurrency(
                          data.getTreasury.marketData.tvl,
                          defaultLocale,
                          defaultCurrency,
                        )}
                  </p>

                  <div className="flex text-[10px] sm:text-base text-sub-dark font-medium gap-x-1">
                    {t('tvl')}
                    <Tooltip>{t('tvlTooltip')}</Tooltip>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col py-1">
              {isLoading ? (
                <>
                  <BoldSubDarkTextSkeleton />
                  <BaseSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-bold text-sub-dark sm:text-xl">
                    {isError || !data?.getTreasury?.marketData?.tvlInEth ? (
                      'N/A'
                    ) : (
                      <span>
                        Ξ
                        {formatBalance(
                          data.getTreasury.marketData.tvlInEth,
                          defaultLocale,
                          2,
                          'standard',
                        )}
                      </span>
                    )}
                  </p>
                  <div className="flex text-[10px] sm:text-base text-sub-dark font-medium gap-x-1">
                    {t('tvlInEth')}
                    <Tooltip>{t('tvlInEthTooltip')}</Tooltip>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col py-1">
              {isLoading ? (
                <>
                  <BoldSubDarkTextSkeleton />
                  <BaseSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-bold text-sub-dark sm:text-xl">
                    {isError ||
                    !data?.getTreasury?.marketData?.capitalUtilisation
                      ? 'N/A'
                      : formatAsPercent(
                          data.getTreasury.marketData.capitalUtilisation,
                          defaultLocale,
                        )}
                  </p>
                  <div className="flex text-[10px] sm:text-base text-sub-dark font-medium gap-x-1">
                    {t('capitalUtilization')}
                    <Tooltip>{t('capitalUtilizationTooltip')}</Tooltip>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 items-center w-full sm:w-fit">
            <div className="flex flex-col p-[3px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full sm:w-40">
              <div className="bg-gradient-to-r from-white via-white to-background p-1 rounded-md">
                {isLoading ? (
                  <BoxLoading />
                ) : (
                  <>
                    <p className="font-bold text-primary text-xl">
                      {isError || !data?.getTreasury?.marketData?.avgAPR
                        ? 'N/A'
                        : formatAsPercent(
                            data.getTreasury.marketData.avgAPR,
                            defaultLocale,
                          )}
                    </p>
                    <div className="flex text-base text-sub-dark font-medium gap-x-1">
                      {t('averageAPR')}
                      <Tooltip>{t('capitalUtilizationTooltip')}</Tooltip>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col p-[3px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full sm:w-40">
              <div className="bg-gradient-to-r from-white via-white to-background p-1 rounded-md">
                {isLoading ? (
                  <BoxLoading />
                ) : (
                  <>
                    <p className="font-bold text-primary text-xl">
                      {isError || !data?.getTreasury?.marketData?.auxoAPR
                        ? 'N/A'
                        : formatAsPercent(
                            data.getTreasury.marketData.auxoAPR,
                            defaultLocale,
                          )}
                    </p>
                    <div className="flex text-base text-sub-dark font-medium gap-x-1">
                      {t('AUXOAPR')}
                      <Tooltip>{t('capitalUtilizationTooltip')}</Tooltip>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        {isLoading ? <></> : <TreasuryTabs {...data.getTreasury.content} />}
        <PositionsTabs />
      </div>
    </>
  );
}

Treasury.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
