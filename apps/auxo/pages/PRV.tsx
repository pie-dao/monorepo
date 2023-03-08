import { ReactElement, useEffect } from 'react';
import Image from 'next/image';
import xAUXOIcon from '../public/tokens/xAUXO.svg';
import { Layout } from '../components';
import { wrapper } from '../store';
import DoubleCheckmark from '../public/images/icons/double-checkmark.svg';
import useTranslation from 'next-translate/useTranslation';
import Tooltip from '../components/Tooltip/Tooltip';
import {
  BoldSubDarkTextSkeleton,
  BaseSubDarkTextSkeleton,
} from '../components/Skeleton';
import { formatBalance, formatAsPercent } from '../utils/formatBalance';
import { useAppDispatch, useAppSelector } from '../hooks';
import Swap from '../components/Swap/Swap';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import {
  thunkGetUserProductsData,
  thunkGetUserStakingData,
} from '../store/products/thunks';
import TokensConfig from '../config/products.json';
import { TokenConfig } from '../types/tokensConfig';
import Summary from '../components/Summary/xAUXOSummary';

export default function XAUXO({
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

  const { account, chainId } = useWeb3React<Web3Provider>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!account && !chainId) return;
    dispatch(
      thunkGetUserProductsData({
        account,
        spender: tokenConfig.addresses[chainId]?.address,
      }),
    );
    dispatch(
      thunkGetUserStakingData({
        account,
      }),
    );
  }, [
    account,
    dispatch,
    stakingTokenConfig.addresses,
    chainId,
    tokenConfig.addresses,
  ]);

  const data = null;
  const isError = false;

  return (
    <>
      <div className="flex flex-col">
        <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap">
          <div className="flex flex-wrap sm:flex-nowrap flex-1 items-center gap-2 sm:bg-gradient-primary sm:rounded-full sm:shadow-md self-center w-full xl:w-auto p-2 sm:p-0">
            <div className="flex gap-x-2 order-1 items-center">
              <div className="flex flex-shrink-0">
                <Image
                  src={xAUXOIcon}
                  alt={'xAUXO Icon'}
                  width={32}
                  height={32}
                  priority
                />
              </div>
              <h2
                className="text-base lg:text-lg font-bold text-primary w-fit"
                data-cy="product-name"
              >
                {t('PassiveRewardVault')}
              </h2>
            </div>
            <div className="flex items-center sm:ml-auto order-3 sm:order-2 gap-x-2 w-full sm:w-fit">
              <div className="w-full sm:hidden md:flex md:w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                <Image
                  src={DoubleCheckmark}
                  alt="double checkmark"
                  width={18}
                  height={18}
                  priority
                />
                <span>{t('worryFreeStaking')}</span>
              </div>
              <div className="w-full sm:hidden md:flex md:w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                <Image
                  src={DoubleCheckmark}
                  alt="double checkmark"
                  width={18}
                  height={18}
                  priority
                />
                <span>{t('unstakeAnyTime')}</span>
              </div>
              <div className="w-full sm:hidden md:flex md:w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                <Image
                  src={DoubleCheckmark}
                  alt="double checkmark"
                  width={18}
                  height={18}
                  priority
                />
                <span>{t('fixedRewards')}</span>
              </div>
            </div>
          </div>
        </section>
        {/* Section for TVL, Capital Utilization, and APY */}
        <section className="flex flex-wrap justify-between gap-4  text-xs md:text-inherit mt-6">
          <div className="flex gap-x-4 items-center w-full sm:w-fit">
            <div className="flex flex-col py-1">
              {!stakingAmount ? (
                <>
                  <BaseSubDarkTextSkeleton />
                  <BoldSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-bold text-sub-dark text-base sm:text-xl">
                    {formatBalance(
                      stakingAmount.label,
                      defaultLocale,
                      2,
                      'standard',
                    )}
                  </p>
                  <div className="flex text-base text-sub-dark font-medium gap-x-1">
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
                  <p className="font-bold text-base text-sub-dark sm:text-xl">
                    <span>
                      {formatBalance(
                        totalSupply.label,
                        defaultLocale,
                        2,
                        'standard',
                      )}
                    </span>
                  </p>
                  <div className="flex text-base text-sub-dark font-medium gap-x-1">
                    {t('total', { token: 'PRV' })}
                    <Tooltip>{t('totalTooltip', { token: 'PRV' })}</Tooltip>
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
                  {t('apr', { token: 'PRV' })}
                  <Tooltip>{t('aprTooltip', { token: 'PRV' })}</Tooltip>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section for Staking and Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4  text-xs md:text-inherit mt-6">
          <Swap
            stakingTokenConfig={stakingTokenConfig}
            tokenConfig={tokenConfig}
          />
          <Summary tokenConfig={tokenConfig} />
        </section>
      </div>
    </>
  );
}

XAUXO.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  const xAUXO = TokensConfig['PRV'] as TokenConfig;
  const AUXO = TokensConfig['AUXO'] as TokenConfig;
  return {
    // does not seem to work with key `initialState`
    props: {
      title: 'Stake',
      tokenConfig: xAUXO,
      stakingTokenConfig: AUXO,
    },
  };
});
