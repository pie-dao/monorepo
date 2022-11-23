import { ReactElement, useEffect } from 'react';
import Image from 'next/image';
import veAUXOicon from '../public/tokens/veAUXO.svg';
import diamond from '../public/images/icons/diamond.svg';
import { Layout } from '../components';
import { wrapper } from '../store';
import { addVeAUXOToWallet } from '../utils/addTokenToWallet';
import { MetamaskIcon } from '@shared/ui-library';
import useTranslation from 'next-translate/useTranslation';
import Tooltip from '../components/Tooltip/Tooltip';
import {
  BoldSubDarkTextSkeleton,
  BaseSubDarkTextSkeleton,
} from '../components/Skeleton';
import { formatBalance, formatAsPercent } from '../utils/formatBalance';
import { useAppDispatch, useAppSelector } from '../hooks';
import Stake from '../components/Stake/Stake';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import {
  thunkGetUserProductsData,
  thunkGetUserStakingData,
} from '../store/products/thunks';
import TokensConfig from '../config/products.json';
import { TokenConfig } from '../types/tokensConfig';
import Summary from '../components/Summary/VeAUXOSummary';
import ContentBanner from '../components/ContentBanner/ContentBanner';
import {
  useIsUserMaxLockDuration,
  useUserLockDurationInSeconds,
} from '../hooks/useToken';
import BoostStake from '../components/BoostStake/BoostStake';
import IncreaseLock from '../components/IncreaseLock/IncreaseLock';

export default function VeAUXO({
  tokenConfig,
  stakingTokenConfig,
}: {
  tokenConfig: TokenConfig;
  stakingTokenConfig: TokenConfig;
}) {
  const { t } = useTranslation();
  const { defaultLocale } = useAppSelector((state) => state.preferences);

  const stakingAmount = useAppSelector(
    (state) => state.dashboard?.tokens[tokenConfig.name]?.stakingAmount,
  );

  const totalSupply = useAppSelector(
    (state) => state.dashboard?.tokens[tokenConfig.name]?.totalSupply,
  );

  const userLockDuration = useUserLockDurationInSeconds('veAUXO');
  const isMaxxed = useIsUserMaxLockDuration('veAUXO');

  const { account, chainId } = useWeb3React<Web3Provider>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!account && !chainId) return;
    dispatch(
      thunkGetUserProductsData({
        account,
        spender: stakingTokenConfig.addresses[chainId]?.stakingAddress,
      }),
    );
    dispatch(
      thunkGetUserStakingData({
        account,
      }),
    );
  }, [account, dispatch, stakingTokenConfig.addresses, chainId]);

  const data = null;
  const isError = false;

  return (
    <>
      <div className="flex flex-col">
        <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap px-4 md:pl-10 md:pr-8">
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
              {!stakingAmount ? (
                <>
                  <BaseSubDarkTextSkeleton />
                  <BoldSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-bold text-sub-dark sm:text-xl">
                    {formatBalance(
                      stakingAmount.label,
                      defaultLocale,
                      2,
                      'standard',
                    )}
                  </p>
                  <div className="flex text-[10px] sm:text-base text-sub-dark font-medium gap-x-1">
                    {t('totalStaked', { token: 'AUXO' })}
                    <Tooltip>
                      {t('totalStakedTooltip', { token: 'AUXO' })}
                    </Tooltip>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col py-1">
              {!totalSupply ? (
                <>
                  <BaseSubDarkTextSkeleton />
                  <BoldSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-bold text-sub-dark sm:text-xl">
                    <span>
                      {formatBalance(
                        totalSupply.label,
                        defaultLocale,
                        2,
                        'standard',
                      )}
                    </span>
                  </p>
                  <div className="flex text-[10px] sm:text-base text-sub-dark font-medium gap-x-1">
                    {t('total', { token: 'veAUXO' })}
                    <Tooltip>{t('totalTooltip', { token: 'veAUXO' })}</Tooltip>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col py-1">
              {!totalSupply ? (
                <>
                  <BaseSubDarkTextSkeleton />
                  <BoldSubDarkTextSkeleton />
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
                <p className="font-bold text-primary text-xl">
                  {isError || !data?.getTreasury?.marketData?.avgAPR
                    ? 'N/A'
                    : formatAsPercent(0, defaultLocale)}
                </p>
                <div className="flex text-base text-sub-dark font-medium gap-x-1">
                  {t('lastMonthDistribution')}
                  <Tooltip>{t('lastMonthDistributionTooltip')}</Tooltip>
                </div>
              </div>
            </div>
            <div className="flex flex-col p-[3px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full sm:w-fit">
              <div className="bg-gradient-to-r from-white via-white to-background px-4 py-1 rounded-md">
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
              </div>
            </div>
          </div>
        </section>
        {/* Section for Staking and Summary */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4 md:px-10 text-xs md:text-inherit mt-6">
          <Stake tokenConfig={stakingTokenConfig} />
          <Summary tokenConfig={tokenConfig} />
        </section>
        {/* Non connected wallet content */}
        {!account ||
          (!userLockDuration && (
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4 md:px-10 text-xs md:text-inherit mt-6">
              <ContentBanner
                title="stakeAUXO"
                icon={<Image src={diamond} alt="diamond" />}
                description="stakeAUXODescription"
              />
              <ContentBanner
                title="earnRewards"
                icon={<Image src={diamond} alt="diamond" />}
                description="earnRewardsDescription"
              />
            </section>
          ))}
        {account && userLockDuration && (
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4 md:px-10 text-xs md:text-inherit mt-6">
            <BoostStake />
            {!isMaxxed && <IncreaseLock tokenConfig={tokenConfig} />}
          </section>
        )}
      </div>
    </>
  );
}

VeAUXO.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  const veAUXO = TokensConfig['veAUXO'] as TokenConfig;
  const AUXO = TokensConfig['AUXO'] as TokenConfig;
  return {
    // does not seem to work with key `initialState`
    props: {
      title: 'Stake',
      tokenConfig: veAUXO,
      stakingTokenConfig: AUXO,
    },
  };
});
