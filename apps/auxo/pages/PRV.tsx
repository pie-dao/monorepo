import { ReactElement, useEffect } from 'react';
import Image from 'next/image';
import xAUXOIcon from '../public/tokens/xAUXO.svg';
import { Layout } from '../components';
import { wrapper } from '../store';
import addTokenToWallet from '../utils/addTokenToWallet';
import { MetamaskIcon } from '@shared/ui-library';
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
        <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap px-4 md:pl-10 md:pr-8">
          <div className="flex flex-1 items-center gap-x-2 bg-gradient-primary rounded-full shadow-card self-center w-full xl:w-auto p-2 md:p-0">
            <Image src={xAUXOIcon} alt={'xAUXO Icon'} width={32} height={32} />
            <h2
              className="text-lg font-medium text-primary w-fit"
              data-cy="product-name"
            >
              PRV
            </h2>
            <button
              className="flex ml-auto pr-2"
              onClick={async () => await addTokenToWallet(chainId, 'PRV')}
            >
              <div className="flex gap-x-2 items-center">
                <div className="hidden lg:flex gap-x-1">
                  <span className="text-sub-dark underline text-sm hover:text-sub-light">
                    {t('addTokenToWallet', {
                      token: `PRV`,
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 md:px-10 text-xs md:text-inherit mt-6">
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
