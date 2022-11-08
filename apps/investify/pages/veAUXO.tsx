import { ReactElement } from 'react';
import Image from 'next/image';
import type { NextPageWithLayout } from './_app';
import veAUXOicon from '../public/tokens/veAUXO.svg';
import { Layout } from '../components';
import { wrapper } from '../store';
import { addVeAUXOToWallet } from '../utils/addTokenToWallet';
import { MetamaskIcon } from '@shared/ui-library';
import useTranslation from 'next-translate/useTranslation';
import Tooltip from '../components/Tooltip/Tooltip';
import {
  BoldSubDarkTextSkeleton,
  BaseSubDarkTextSkeleton,
  BoxLoading,
} from '../components/Skeleton';
import {
  formatBalanceCurrency,
  formatBalance,
  formatAsPercent,
} from '../utils/formatBalance';
import { useAppSelector } from '../hooks';

const VeAUXO: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );

  const isLoading = false;
  const data = null;
  const isError = false;

  return (
    <>
      <div className="flex flex-col">
        <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap px-4 md:pl-12 md:pr-8">
          <div className="flex flex-1 items-center gap-x-2 bg-gradient-primary rounded-full shadow-card self-center w-full xl:w-auto p-2 md:p-0">
            <Image
              src={veAUXOicon}
              alt={'veAUXO Icon'}
              width={32}
              height={32}
            />
            <h2
              className="text-lg font-medium text-primary w-fit"
              data-cy="product-name"
            >
              veAUXO
            </h2>
            <button className="flex ml-auto pr-2" onClick={addVeAUXOToWallet}>
              <div className="flex gap-x-2 items-center">
                <div className="hidden lg:flex gap-x-1">
                  <span className="text-sub-dark underline text-sm hover:text-sub-light">
                    {t('addTokenToWallet', {
                      token: `veAUXO`,
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
          <div className="flex gap-x-4 items-center w-full sm:w-fit">
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
                    {t('totalStaked', { token: 'veAUXO' })}
                    <Tooltip>
                      {t('totalStakedTooltip', { token: 'veAUXO' })}
                    </Tooltip>
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
                    {t('total', { token: 'veAUXO' })}
                    <Tooltip>{t('totalTooltip', { token: 'veAUXO' })}</Tooltip>
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
                    {t('votingAddresses')}
                    <Tooltip>{t('votingAddressesTooltip')}</Tooltip>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-x-2 items-center w-full sm:w-fit">
            <div className="flex flex-col p-[3px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full sm:w-fit">
              <div className="bg-gradient-to-r from-white via-white to-background px-4 py-1 rounded-md">
                {isLoading ? (
                  <BoxLoading />
                ) : (
                  <>
                    <p className="font-bold text-primary text-xl">
                      {isError || !data?.getTreasury?.marketData?.avgAPR
                        ? 'N/A'
                        : formatAsPercent(0, defaultLocale)}
                    </p>
                    <div className="flex text-base text-sub-dark font-medium gap-x-1">
                      {t('lastMonthDistribution')}
                      <Tooltip>{t('lastMonthDistributionTooltip')}</Tooltip>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col p-[3px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full sm:w-fit">
              <div className="bg-gradient-to-r from-white via-white to-background px-4 py-1 rounded-md">
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
                      {t('apr', { token: 'veAUXO' })}
                      <Tooltip>{t('aprTooltip', { token: 'veAUXO' })}</Tooltip>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

VeAUXO.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  // this gets rendered on the server, then not on the client
  return {
    // does not seem to work with key `initialState`
    props: { title: 'Stake' },
  };
});

export default VeAUXO;
