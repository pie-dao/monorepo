import { ReactElement, useEffect } from 'react';
import Image from 'next/image';
import PRVIcon from '../public/tokens/32x32/PRV.svg';
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
import { useSetChain } from '@web3-onboard/react';
import {
  thunkGetUserProductsData,
  thunkGetUserPrvWithdrawal,
  thunkGetUserStakingData,
} from '../store/products/thunks';
import TokensConfig from '../config/products.json';
import { TokenConfig } from '../types/tokensConfig';
import Summary from '../components/Summary/xAUXOSummary';
import TokenCarousel from '../components/TokenCarousel/TokenCarousel';
import Trans from 'next-translate/Trans';
import PrvWithdrawalTree from '../config/PrvWithdrawalTree.json';
import { usePRVMerkleVerifier } from '../hooks/useContracts';
import { PrvWithdrawalMerkleTree } from '../types/merkleTree';
import AddToWallet from '../components/AddToWallet/AddToWallet';
import { useConnectWallet } from '@web3-onboard/react';
import { getPRVWithdrawalMerkleTree } from '../utils/getUserMerkleTree';

const prvTree = PrvWithdrawalTree as PrvWithdrawalMerkleTree;

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

  const prvMerkleVerifier = usePRVMerkleVerifier();
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  const [{ wallet }] = useConnectWallet();

  const account = wallet?.accounts[0]?.address;
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!wallet && !chainId) return;
    dispatch(
      thunkGetUserProductsData({
        account,
        provider: wallet?.provider,
        spender: tokenConfig.addresses[chainId]?.address,
      }),
    );
    dispatch(
      thunkGetUserStakingData({
        account,
        provider: wallet?.provider,
      }),
    );
  }, [
    account,
    dispatch,
    stakingTokenConfig.addresses,
    chainId,
    tokenConfig.addresses,
    wallet,
  ]);

  const data = null;
  const isError = false;

  useEffect(() => {
    if (prvTree && prvTree?.recipients && account && prvMerkleVerifier) {
      dispatch(
        thunkGetUserPrvWithdrawal({
          account,
          claim: {
            ...getPRVWithdrawalMerkleTree(prvTree, account),
            account,
          },
          prvMerkleVerifier,
        }),
      );
    }
  }, [account, dispatch, prvMerkleVerifier]);

  return (
    <>
      <div className="flex flex-col">
        <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap">
          <div className="flex flex-wrap sm:flex-nowrap flex-1 items-center gap-2 sm:bg-gradient-primary sm:rounded-full sm:shadow-md self-center w-full xl:w-auto p-2 sm:p-0 sm:px-3 sm:py-2">
            <div className="flex flex-shrink-0">
              <Image
                src={PRVIcon}
                alt={'PRV'}
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
            <AddToWallet token="PRV" />
          </div>
        </section>
        {/* Section for TVL, Capital Utilization, and APY */}
        <section className="flex flex-wrap justify-between gap-4  text-xs md:text-inherit mt-6">
          <div className="flex gap-x-4 items-center w-full sm:w-fit flex-wrap">
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
                  <div className="flex text-base text-sub-dark font-medium gap-x-1 items-center">
                    {t('totalStaked', { token: 'PRV' })}
                    <Tooltip>{t('totalStakedPrvTooltip')}</Tooltip>
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
                  <div className="flex text-base text-sub-dark font-medium gap-x-1 items-center">
                    {t('total', { token: 'PRV' })}
                    <Tooltip>{t('totalTooltip', { token: 'PRV' })}</Tooltip>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-x-2 items-center w-full sm:w-fit">
            {/* <div className="flex flex-col p-[3px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full sm:w-fit">
              <div className="bg-gradient-to-r from-white via-white to-background p-2.5 rounded-md">

                <p className="font-bold text-primary text-xl">
                  {isError || !data?.getTreasury?.marketData?.avgAPR
                    ? 'N/A'
                    : formatAsPercent(0, defaultLocale)}
                </p>
                <div className="flex text-base text-sub-dark font-medium gap-x-1 items-center">
                  {t('lastMonthDistribution')}
                  <Tooltip>{t('lastMonthDistributionTooltip')}</Tooltip>
                </div>
              </div>
            </div> */}
            <div className="flex flex-col p-[2px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full">
              <div className="bg-gradient-to-r from-white via-white to-background p-2.5 rounded-md">
                <p className="font-bold text-primary text-xl">
                  {isError || !data?.getTreasury?.marketData?.auxoAPR
                    ? 'N/A'
                    : formatAsPercent(
                        data.getTreasury.marketData.auxoAPR,
                        defaultLocale,
                      )}
                </p>
                <div className="flex text-base text-sub-dark font-medium gap-x-1 items-center">
                  {t('apr', { token: 'PRV' })}
                  <Tooltip>{t('aprTooltip', { token: 'PRV' })}</Tooltip>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-6">
          <TokenCarousel>
            <div className="relative h-[560px] flex-[0_0_100%] min-w-0">
              <div className="overflow-hidden shadow-sm items-start w-full font-medium transition-all mx-auto bg-center bg-no-repeat bg-[url('/images/background/ARV/ARV_SLIDE_1.png')] bg-cover h-full relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full flex flex-col place-items-center">
                  <div className="flex flex-shrink-0 mb-12">
                    <svg
                      width="41"
                      height="41"
                      viewBox="0 0 41 41"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10"
                    >
                      <path
                        d="M13.9287 41H19.5686H19.6491H21.5022H21.5828H27.2227L40.8389 11.8339L31.3317 6.03292L21.5022 0.3125H21.4619V10.9476H21.5022L28.4312 15.2984L21.5022 32.6208H19.6491L12.7202 15.2984L19.6491 10.9476H19.6894V0.3125H19.6491L9.81968 6.03292L0.3125 11.8339L13.9287 41Z"
                        fill="#1F0860"
                      />
                    </svg>
                  </div>
                  <Trans
                    i18nKey="prvSlide1Title"
                    components={{
                      highlight: (
                        <p className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/20 font-bold" />
                      ),
                    }}
                  />
                  <p className=" max-w-sm text-primary font-semibold text-xl mt-2 mx-auto">
                    <Trans
                      i18nKey="prvSlide1Description"
                      components={{
                        br: <br />,
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[560px] flex-[0_0_100%] min-w-0">
              <div className="overflow-hidden relative shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/PRV/PRV_SLIDE_1.png')] bg-cover h-full">
                <div className="absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 lg:left-0 lg:-translate-x-0 text-center lg:text-left w-full flex flex-col max-w-[90%] mx-auto lg:mx-16 gap-y-6">
                  <h2 className="text-lg md:text-4xl bg-clip-text text-transparent bg-gradient-major-colors font-bold">
                    {t('prvSlide2Title')}
                  </h2>
                  <p className="font-medium text-sm lg:text-base text-white">
                    {t('prvSlide2Description')}
                  </p>
                  <div className="flex gap-x-6 gap-y-2 flex-wrap">
                    <div className="w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                      <div className="flex flex-shrink-0">
                        <Image
                          src={DoubleCheckmark}
                          alt="double checkmark"
                          width={18}
                          height={18}
                          priority
                        />
                      </div>
                      <span>{t('votingNotRequired')}</span>
                    </div>
                    <div className="w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                      <div className="flex flex-shrink-0">
                        <Image
                          src={DoubleCheckmark}
                          alt="double checkmark"
                          width={18}
                          height={18}
                          priority
                        />
                      </div>
                      <span>{t('earningTreasuryYield')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[560px] flex-[0_0_100%] min-w-0">
              <div className="overflow-hidden  relative shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/PRV/PRV_SLIDE_2.png')] bg-cover h-full">
                <div className="absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 lg:left-0 lg:-translate-x-0 text-center lg:text-left w-full flex flex-col max-w-[90%] mx-auto lg:mx-16 gap-y-6">
                  <h2 className="text-lg md:text-4xl bg-clip-text text-transparent bg-gradient-major-colors font-bold">
                    {t('prvSlide3Title')}
                  </h2>
                  <p className="font-medium text-sm lg:text-base text-white">
                    {t('prvSlide3Description1')}
                  </p>
                  <p className="font-medium text-sm lg:text-base text-white">
                    {t('prvSlide3Description2')}
                  </p>
                  <div className="flex gap-x-6 gap-y-2 flex-wrap">
                    <div className="w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                      <div className="flex flex-shrink-0">
                        <Image
                          src={DoubleCheckmark}
                          alt="double checkmark"
                          width={18}
                          height={18}
                          priority
                        />
                      </div>
                      <span>{t('unstakeAnytime')}</span>
                    </div>
                    <div className="w-fit bg-secondary text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full gap-x-2 flex items-center">
                      <div className="flex flex-shrink-0">
                        <Image
                          src={DoubleCheckmark}
                          alt="double checkmark"
                          width={18}
                          height={18}
                          priority
                        />
                      </div>
                      <span>{t('stakeAtLeastOneEpoch')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TokenCarousel>
        </section>
        {/* Section for Staking and Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4  text-xs md:text-inherit mt-6">
          <Swap
            stakingTokenConfig={stakingTokenConfig}
            tokenConfig={tokenConfig}
            claim={{
              ...getPRVWithdrawalMerkleTree(prvTree, account),
              account,
            }}
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
