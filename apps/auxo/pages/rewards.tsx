import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect, useState } from 'react';
import { Layout } from '../components';
import GradientBox from '../components/GradientBox/GradientBox';
import {
  BaseSubDarkTextSkeleton,
  BoldSubDarkTextSkeleton,
} from '../components/Skeleton';
import Tooltip from '../components/Tooltip/Tooltip';
import { defaultLocale } from '../i18n';
import { wrapper } from '../store';
import { BigNumberReference } from '../store/products/products.types';
import { formatBalance } from '../utils/formatBalance';

import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import { LATEST_MERKLE_TREE_URL } from '../utils/constants';
import TotalRewardsBar from '../components/TotalRewardsBar/TotalRewardsBar';
import { useAppDispatch, useAppSelector } from '../hooks';
import { MerkleTree } from '../types/merkleTree';
import { thunkGetUserRewards } from '../store/rewards/rewards.thunks';
import TotalRewards from '../components/TotalRewards/TotalRewards';
import RewardsHistory from '../components/RewardsHistory/RewardsHistory';
import RewardsHistoryChart from '../components/RewardsHistoryChart/RewardsHistoryChart';
import { useMerkleDistributor } from '../hooks/useContracts';
import { useWeb3React } from '@web3-react/core';
import merkleTreesByUser from '../config/merkleTreesByUser.json';
import { useTokenBalance, useUserStakedPRV } from '../hooks/useToken';
import {
  thunkGetUserProductsData,
  thunkGetUserStakingData,
} from '../store/products/thunks';
import { useSingleRewardList } from '../hooks/useRewards';
import { orderBy } from 'lodash';

export default function Rewards() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const ArvBalance = useTokenBalance('ARV');
  const StakedPrvBalance = useUserStakedPRV();
  const allTimeTotal = useAppSelector(
    (state) => state.rewards.data.metadata.allTimeTotal,
  );

  const lastDistributionAmount = {
    label: 2000000,
    value: '2000000',
  };

  useEffect(() => {
    if (merkleTreesByUser && account) {
      dispatch(
        thunkGetUserRewards({
          account,
          rewards: merkleTreesByUser[account],
        }),
      );
    }
  }, [account, dispatch]);

  useEffect(() => {
    if (account) {
      dispatch(thunkGetUserProductsData({ account }));
      dispatch(thunkGetUserStakingData({ account }));
    }
  }, [account, dispatch]);

  return (
    <div className="flex flex-col">
      <section className="flex flex-wrap justify-between gap-4 text-xs md:text-inherit mt-6">
        <div className="flex gap-x-4 items-center w-full sm:w-fit flex-wrap">
          <div className="flex flex-col py-1">
            {!ArvBalance ? (
              <>
                <BoldSubDarkTextSkeleton />
                <BaseSubDarkTextSkeleton />
              </>
            ) : (
              <>
                <p className="font-bold text-sub-dark sm:text-xl">
                  {formatBalance(
                    ArvBalance.label,
                    defaultLocale,
                    2,
                    'standard',
                  )}
                </p>
                <div className="flex text-[10px] sm:text-base text-primary font-semibold gap-x-1">
                  {t('compactTokenBalance', { token: 'ARV' })}
                  <Tooltip>{t('totalStakedTooltip', { token: 'ARV' })}</Tooltip>
                </div>
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
                <p className="font-bold text-sub-dark sm:text-xl">
                  <span>
                    {formatBalance(
                      StakedPrvBalance.label,
                      defaultLocale,
                      2,
                      'standard',
                    )}
                  </span>
                </p>
                <div className="flex text-[10px] sm:text-base text-primary font-semibold gap-x-1">
                  {t('compactStakedBalance', { token: 'PRV' })}
                  <Tooltip>{t('totalTooltip', { token: 'veAUXO' })}</Tooltip>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-x-2 items-center w-full sm:w-fit">
          <GradientBox>
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
              <div className="flex text-base text-sub-dark font-medium gap-x-1">
                {t('lastMonthEarnings')}
                <Tooltip>{t('lastMonthEarningsTooltip')}</Tooltip>
              </div>
            </>
          </GradientBox>
          <GradientBox>
            <>
              <p className="font-bold text-primary text-xl">
                <span>
                  ETH{' '}
                  {formatBalance(
                    allTimeTotal.label,
                    defaultLocale,
                    4,
                    'standard',
                  )}
                </span>
              </p>
              <div className="flex text-base text-sub-dark font-medium gap-x-1">
                {t('allTimeTotal')}
                <Tooltip>{t('allTimeTotal')}</Tooltip>
              </div>
            </>
          </GradientBox>
        </div>
      </section>
      <TotalRewardsBar />
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
