import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect } from 'react';
import { Layout } from '../components';
import GradientBox from '../components/GradientBox/GradientBox';
import {
  BaseSubDarkTextSkeleton,
  BoldSubDarkTextSkeleton,
} from '../components/Skeleton';
import { defaultLocale } from '../i18n';
import { wrapper } from '../store';
import { formatBalance } from '../utils/formatBalance';
import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';
import { MERKLE_TREES_BY_USER_URL } from '../utils/constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { MerkleTreesByUser } from '../types/merkleTree';
import { thunkGetUserRewards } from '../store/rewards/rewards.thunks';
import TotalRewards from '../components/TotalRewards/TotalRewards';
import RewardsHistory from '../components/RewardsHistory/RewardsHistory';
import RewardsHistoryChart from '../components/RewardsHistoryChart/RewardsHistoryChart';
import { useConnectWallet } from '@web3-onboard/react';
import { useTokenBalance, useUserStakedPRV } from '../hooks/useToken';
import {
  thunkGetUserProductsData,
  thunkGetUserStakingData,
} from '../store/products/thunks';
import getUserMerkleTree from '../utils/getUserMerkleTree';

export default function Rewards({ title }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const ArvBalance = useTokenBalance('ARV');
  const StakedPrvBalance = useUserStakedPRV();
  const allTimeTotal = useAppSelector(
    (state) => state?.rewards?.data?.metadata?.allTimeTotal,
  );

  const { data: merkleTreesByUser } = useSWR<MerkleTreesByUser>(
    MERKLE_TREES_BY_USER_URL,
    fetcher,
  );

  useEffect(() => {
    if (merkleTreesByUser && account) {
      dispatch(
        thunkGetUserRewards({
          account,
          rewards: getUserMerkleTree(merkleTreesByUser, account),
        }),
      );
    }
  }, [account, dispatch, merkleTreesByUser]);

  useEffect(() => {
    if (account && wallet?.provider) {
      dispatch(
        thunkGetUserProductsData({ account, provider: wallet?.provider }),
      );
      dispatch(
        thunkGetUserStakingData({ account, provider: wallet?.provider }),
      );
    }
  }, [account, dispatch, wallet?.provider]);

  return (
    <div className="flex flex-col">
      <h2 className="flex sm:hidden text-2xl font-semibold text-primary w-auto drop-shadow-md ml-[10px]">
        {t(title)}
      </h2>
      <section className="flex flex-wrap justify-between gap-4 text-xs md:text-inherit mt-6">
        <div className="flex gap-x-4 items-center w-full sm:w-fit ml-[10px] flex-wrap">
          <div className="flex flex-col py-1">
            {!ArvBalance ? (
              <>
                <BoldSubDarkTextSkeleton />
                <BaseSubDarkTextSkeleton />
              </>
            ) : (
              <>
                <p className="font-semibold text-primary text-base sm:text-xl">
                  {formatBalance(
                    ArvBalance.label,
                    defaultLocale,
                    2,
                    'standard',
                  )}{' '}
                  ARV
                </p>
                <p className="flex text-base text-primary font-medium gap-x-1 items-center">
                  {t('compactTokenBalance', { token: 'ARV' })}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col py-1">
            {!StakedPrvBalance ? (
              <>
                <BoldSubDarkTextSkeleton />
                <BaseSubDarkTextSkeleton />
              </>
            ) : (
              <>
                <p className="font-semibold text-primary text-base sm:text-xl">
                  <span>
                    {formatBalance(
                      StakedPrvBalance.label,
                      defaultLocale,
                      2,
                      'standard',
                    )}{' '}
                    PRV
                  </span>
                </p>
                <p className="flex text-base text-primary font-medium gap-x-1 items-center">
                  {t('compactStakedBalance', { token: 'PRV' })}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-x-2 items-center w-full sm:w-fit">
          {/* <GradientBox>
            <>
              <p className="font-bold text-primary text-xl">
                <span>
                  ETH{' '}
                  {formatBalance(
                    lastDistributionAmount.label,
                    defaultLocale,
                    4,
                    'standard',
                  )}
                </span>
              </p>
              <div className="flex text-base text-primary font-medium gap-x-1 items-center">
                {t('lastMonthEarnings')}
                <Tooltip>{t('lastMonthEarningsTooltip')}</Tooltip>
              </div>
            </>
          </GradientBox> */}
          <GradientBox>
            <>
              <p className="font-bold text-primary text-xl">
                <span>
                  ETH{' '}
                  {formatBalance(
                    allTimeTotal?.label,
                    defaultLocale,
                    4,
                    'standard',
                  )}
                </span>
              </p>
              <div className="flex text-base text-primary font-medium gap-x-1 items-center">
                {t('allTimeTotal')}
              </div>
            </>
          </GradientBox>
        </div>
      </section>
      {new Date('2023-06').toLocaleDateString('en-US', {
        month: '2-digit',
        year: 'numeric',
      })}
      {new Date('2023-06-01').toLocaleDateString('en-US', {
        month: '2-digit',
        year: 'numeric',
      })}
      {new Date('2023-06-01').toLocaleDateString(defaultLocale, {
        month: '2-digit',
        year: 'numeric',
      })}
      {new Date('2023-06').toLocaleDateString(defaultLocale, {
        month: '2-digit',
        year: 'numeric',
      })}

      <TotalRewards />
      <RewardsHistory />
      <RewardsHistoryChart />
    </div>
  );
}

Rewards.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    // does not seem to work with key `initialState`
    props: {
      title: 'Rewards',
    },
  };
});
