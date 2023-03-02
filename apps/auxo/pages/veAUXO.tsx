import { ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import veAUXOicon from '../public/tokens/veAUXO.svg';
import xAUXOIcon from '../public/tokens/xAUXO.svg';
import { Layout } from '../components';
import { wrapper } from '../store';
import DoubleCheckmark from '../public/images/icons/double-checkmark.svg';
import ThreeDots from '../public/images/icons/three-dots.svg';
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
import ARVNotificationBar from '../components/ARVNotificationBar/ARVNotificationBar';
import { STEPS } from '../store/modal/modal.types';
import { setIsOpen, setStep } from '../store/modal/modal.slice';

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
    (state) => state.dashboard?.tokens?.[tokenConfig.name]?.stakingAmount,
  );

  const votingAddresses = useAppSelector(
    (state) => state.dashboard?.tokens?.[tokenConfig.name]?.votingAddresses,
  );

  const [commitmentValue, setCommitmentValue] = useState(36);
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

  const openEarlyTermination = () => {
    dispatch(setStep(STEPS.EARLY_TERMINATION));
    dispatch(setIsOpen(true));
  };

  const data = null;
  const isError = false;

  return (
    <>
      <div className="flex flex-col">
        <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap px-4 md:pl-10 md:pr-8">
          <div className="flex flex-wrap sm:flex-nowrap flex-1 items-center gap-2 sm:bg-gradient-primary sm:rounded-full sm:shadow-card self-center w-full xl:w-auto p-2 md:p-0">
            <div className="flex gap-x-2 order-1 items-center">
              <Image
                src={veAUXOicon}
                alt={'veAUXO Icon'}
                width={32}
                height={32}
                priority
              />
              <h2
                className="text-sm sm:text-base lg:text-lg font-medium text-primary w-fit"
                data-cy="product-name"
              >
                {t('ActiveRewardVault')}
              </h2>
            </div>
            <div className="flex items-center sm:ml-auto mr-4 order-3 sm:order-2 gap-x-2">
              <div className="bg-secondary text-white text-xs md:text-sm font-medium px-2.5 py-0.5 rounded-full gap-x-2 flex items-center">
                <Image
                  src={DoubleCheckmark}
                  alt="double checkmark"
                  width={18}
                  height={18}
                  priority
                />
                <span>{t('upToRewards')}</span>
              </div>
              <div className="bg-secondary text-white text-xs md:text-sm font-medium px-2.5 py-0.5 rounded-full gap-x-2 flex items-center">
                <Image
                  src={DoubleCheckmark}
                  alt="double checkmark"
                  width={18}
                  height={18}
                  priority
                />
                <span>{t('governanceEnabled')}</span>
              </div>
            </div>
            <div className="flex order-2 sm:order-3 ml-auto md:ml-0">
              <Tooltip
                icon={
                  <Image
                    src={ThreeDots}
                    width={18}
                    height={18}
                    priority
                    alt="three dots"
                  />
                }
              >
                <div className="flex bg-white rounded-md">
                  <button
                    className="flex items-center gap-x-2"
                    onClick={openEarlyTermination}
                  >
                    <Image src={xAUXOIcon} width={16} height={16} alt="xAUXO" />
                    <span className="text-primary font-medium text-sm">
                      {t('earlyTermination')}
                    </span>
                  </button>
                </div>
              </Tooltip>
            </div>
          </div>
        </section>
        {/* Section for TVL, Capital Utilization, and APY */}
        <section className="flex flex-wrap justify-between gap-4 px-4 md:px-10 text-sm md:text-inherit mt-6">
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
                  <div className="flex text-xs sm:text-base text-sub-dark font-medium gap-x-1">
                    {t('totalStaked', { token: 'AUXO' })}
                    <Tooltip>
                      {t('totalStakedTooltip', { token: 'AUXO' })}
                    </Tooltip>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col py-1">
              {!votingAddresses ? (
                <>
                  <BaseSubDarkTextSkeleton />
                  <BoldSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-bold text-sub-dark sm:text-xl">
                    {!votingAddresses ? 'N/A' : votingAddresses}
                  </p>
                  <div className="flex text-xs sm:text-base text-sub-dark font-medium gap-x-1">
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
        <section className="px-4 md:px-10 mt-6">
          <ARVNotificationBar />
        </section>
        {/* Section for Staking and Summary */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4 md:px-10 text-xs md:text-inherit mt-6">
          <Stake
            tokenConfig={stakingTokenConfig}
            commitmentValue={commitmentValue}
            setCommitmentValue={setCommitmentValue}
          />
          <Summary
            tokenConfig={tokenConfig}
            commitmentValue={commitmentValue}
            setCommitmentValue={setCommitmentValue}
          />
        </section>
        {/* Non connected wallet content */}
        {/* {!account ||
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
            {!isMaxxed && <IncreaseLock />}
          </section>
        )} */}
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
      title: 'AuxoToArv',
      tokenConfig: veAUXO,
      stakingTokenConfig: AUXO,
    },
  };
});
