import { ReactElement, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import veAUXOicon from '../public/tokens/32x32/ARV.svg';
import xAUXOIcon from '../public/tokens/32x32/PRV.svg';
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
import { useConnectWallet } from '@web3-onboard/react';
import {
  thunkGetUserProductsData,
  thunkGetUserStakingData,
} from '../store/products/thunks';
import TokensConfig from '../config/products.json';
import { TokenConfig } from '../types/tokensConfig';
import Summary from '../components/Summary/VeAUXOSummary';
import ARVNotificationBar from '../components/ARVNotificationBar/ARVNotificationBar';
import { STEPS } from '../store/modal/modal.types';
import { setIsOpen, setStep, setSwap } from '../store/modal/modal.slice';
import { useSetChain } from '@web3-onboard/react';
import {
  useDecimals,
  useEarlyTerminationFee,
  useTokenBalance,
  useUserHasLock,
  useUserLockAmount,
} from '../hooks/useToken';
import { mulBalances, subBalances } from '../utils/balances';
import TokenCarousel from '../components/TokenCarousel/TokenCarousel';
import Trans from 'next-translate/Trans';
import AddToWallet from '../components/AddToWallet/AddToWallet';

export default function ARV({
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
  const ARVBalance = useTokenBalance(tokenConfig.name);
  const decimals = useDecimals(tokenConfig.name);
  const AuxoBalance = useUserLockAmount(tokenConfig.name);
  const earlyTerminationFee = useEarlyTerminationFee();
  const hasLock = useUserHasLock(tokenConfig.name);
  const [commitmentValue, setCommitmentValue] = useState(36);
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!account && !chainId) return;
    dispatch(
      thunkGetUserProductsData({
        account,
        provider: wallet?.provider,
        spender: stakingTokenConfig.addresses[chainId]?.stakingAddress,
      }),
    );
    dispatch(
      thunkGetUserStakingData({
        account,
        provider: wallet?.provider,
      }),
    );
  }, [account, dispatch, stakingTokenConfig.addresses, chainId, wallet]);

  const losingAmount = useMemo(() => {
    return mulBalances(AuxoBalance, earlyTerminationFee, decimals);
  }, [AuxoBalance, decimals, earlyTerminationFee]);

  const AuxoMinusFee = useMemo(() => {
    return subBalances(AuxoBalance, losingAmount);
  }, [AuxoBalance, losingAmount]);

  const openEarlyTermination = () => {
    dispatch(
      setSwap({
        swap: {
          from: {
            token: tokenConfig.name,
            amount: ARVBalance,
          },
          to: {
            token: 'PRV',
            amount: AuxoMinusFee,
          },
          losingAmount,
        },
      }),
    );
    dispatch(setStep(STEPS.EARLY_TERMINATION));
    dispatch(setIsOpen(true));
  };

  const data = null;
  const isError = false;

  return (
    <>
      <div className="flex flex-col">
        <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap">
          <div className="flex flex-wrap sm:flex-nowrap flex-1 items-center gap-2 sm:bg-gradient-primary sm:rounded-full sm:shadow-md self-center w-full xl:w-auto p-2 sm:px-3 sm:py-2">
            <div className="flex flex-shrink-0">
              <Image
                src={veAUXOicon}
                alt={'veAUXO Icon'}
                width={32}
                height={32}
                priority
              />
            </div>
            <h2
              className="text-base lg:text-lg font-bold text-primary w-fit"
              data-cy="product-name"
            >
              {t('ActiveRewardVault')}
            </h2>
            <AddToWallet token="ARV" />
            {account && hasLock && (
              <div className="flex order-2 sm:order-3 mx-4">
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
                      <Image
                        src={xAUXOIcon}
                        width={16}
                        height={16}
                        alt="xAUXO"
                      />
                      <span className="text-primary font-medium text-sm">
                        {t('earlyTermination')}
                      </span>
                    </button>
                  </div>
                </Tooltip>
              </div>
            )}
          </div>
        </section>
        {/* Section for TVL, Capital Utilization, and APY */}
        <section className="flex flex-wrap justify-between gap-4  text-sm md:text-inherit mt-6">
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
                    <Tooltip>{t('totalStakedArvTooltip')}</Tooltip>
                  </div>
                </>
              )}
            </div>
            {/* <div className="flex flex-col py-1">
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
            </div> */}
          </div>
          <div className="flex gap-x-2 items-center w-full sm:w-fit">
            {/* <div className="flex flex-col p-[3px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full sm:w-fit">
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
            </div> */}
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
                  {t('apr', { token: 'ARV' })}
                  <Tooltip>{t('aprTooltip', { token: 'ARV' })}</Tooltip>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ARVNotificationBar />
        <section className="mt-6">
          <TokenCarousel>
            <div className="relative h-[482px] flex-[0_0_100%] min-w-0">
              <div className="overflow-hidden shadow-sm items-start w-full font-medium transition-all mx-auto bg-center bg-no-repeat bg-[url('/images/background/ARV/ARV_SLIDE_1.png')] bg-cover h-full relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full flex flex-col place-items-center">
                  <div className="flex flex-shrink-0 mb-12">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10"
                    >
                      <path
                        d="M26.4581 0.3125H20.9785H20.9002H19.0998H19.0215H13.5419L0.3125 28.65L9.54958 34.2862L19.0998 39.8441H19.1389V29.5111H19.0998L12.3677 25.2839L19.0998 8.45365H20.9002L27.6323 25.2839L20.9002 29.5111H20.8611V39.8441H20.9002L30.4504 34.2862L39.6875 28.65L26.4581 0.3125Z"
                        fill="#0B78DD"
                      />
                    </svg>
                  </div>
                  <Trans
                    i18nKey="arvSlide1Title"
                    components={{
                      highlight: (
                        <p className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/20 font-bold" />
                      ),
                    }}
                  />
                  <p className=" max-w-sm text-primary font-semibold text-xl mt-2 mx-auto">
                    <Trans
                      i18nKey="arvSlide1Description"
                      components={{
                        br: <br />,
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[482px] flex-[0_0_100%] min-w-0">
              <div className="overflow-hidden relative shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/ARV/ARV_SLIDE_2.png')] bg-cover h-full">
                <div className="absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 lg:left-0 lg:-translate-x-0 text-center lg:text-left w-full flex flex-col max-w-[75%] md:max-w-[50%] mx-auto lg:mx-16 gap-y-8">
                  <h2 className="text-lg md:text-4xl bg-clip-text text-transparent bg-gradient-major-colors font-bold">
                    {t('arvSlide2Title')}
                  </h2>
                  <p className="font-medium text-xs md:text-base text-white">
                    <Trans
                      i18nKey="arvSlide2Description"
                      components={{
                        br: <br />,
                      }}
                    />
                  </p>
                  <div className="flex gap-x-6 gap-y-2 flex-wrap">
                    <div className="w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                      <Image
                        src={DoubleCheckmark}
                        alt="double checkmark"
                        width={18}
                        height={18}
                        priority
                      />
                      <span>{t('earnsMoreRewards')}</span>
                    </div>
                    <div className="w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                      <Image
                        src={DoubleCheckmark}
                        alt="double checkmark"
                        width={18}
                        height={18}
                        priority
                      />
                      <span>{t('directControl')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[482px] flex-[0_0_100%] min-w-0">
              <div className="overflow-hidden relative shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/ARV/ARV_SLIDE_4.png')] bg-cover h-full">
                <div className="absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 lg:left-0 lg:-translate-x-0 text-center lg:text-left w-full flex flex-col max-w-[75%] md:max-w-[50%] mx-auto lg:mx-16 gap-y-8">
                  <h2 className="text-lg md:text-4xl bg-clip-text text-transparent bg-gradient-major-colors font-bold">
                    {t('arvSlide3Title')}
                  </h2>
                  <p className="font-medium text-base text-white">
                    <Trans
                      i18nKey="arvSlide3Description1"
                      components={{
                        br: <br />,
                      }}
                    />
                  </p>
                  <p className="font-medium text-base text-white">
                    {t('arvSlide3Description2')}
                  </p>
                  <div className="flex gap-x-6 gap-y-2 flex-wrap">
                    <div className="w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                      <Image
                        src={DoubleCheckmark}
                        alt="double checkmark"
                        width={18}
                        height={18}
                        priority
                      />
                      <span>{t('longTermAlignment')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[482px] flex-[0_0_100%] min-w-0">
              <div className="overflow-hidden relative shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/ARV/ARV_SLIDE_5.png')] bg-cover h-full">
                <div className="absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 lg:left-0 lg:-translate-x-0 text-center lg:text-left w-full flex flex-col max-w-[75%] md:max-w-[50%] mx-auto lg:mx-16 gap-y-8">
                  <h2 className="text-lg md:text-4xl bg-clip-text text-transparent bg-gradient-major-colors font-bold">
                    {t('arvSlide4Title')}
                  </h2>
                  <p className="font-medium text-base text-white">
                    <Trans
                      i18nKey="arvSlide4Description"
                      components={{
                        br: <br />,
                      }}
                    />
                  </p>
                  <div className="flex gap-x-6 gap-y-2 flex-wrap">
                    <div className="w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                      <Image
                        src={DoubleCheckmark}
                        alt="double checkmark"
                        width={18}
                        height={18}
                        priority
                      />
                      <span>{t('paidActiveParticipants')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TokenCarousel>
        </section>
        {/* Section for Staking and Summary */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4  text-xs md:text-inherit mt-6">
          <Stake
            tokenConfig={stakingTokenConfig}
            destinationToken={tokenConfig}
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

ARV.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  const ARV = TokensConfig['ARV'] as TokenConfig;
  const AUXO = TokensConfig['AUXO'] as TokenConfig;
  return {
    // does not seem to work with key `initialState`
    props: {
      title: 'AuxoToArv',
      tokenConfig: ARV,
      stakingTokenConfig: AUXO,
    },
  };
});
