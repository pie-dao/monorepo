import { wrapper } from '../../store';
import { Layout } from '../../components';
import { ReactElement } from 'react';
import {
  BoldSubDarkTextSkeleton,
  BaseSubDarkTextSkeleton,
} from '../../components/Skeleton';
import {
  formatAsPercent,
  formatBalance,
  formatBalanceCurrency,
} from '../../utils/formatBalance';
import { useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import LendingBanner from '../../components/LendingBanner/LendingBanner';
import CardInfoList, {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/Card/Card';
import Image from 'next/image';
import poolsConfig from '../../config/lendingPools.json';
import { CardSkeleton } from '../../components/Card/Skeleton';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { motion } from 'framer-motion';
import classNames from '../../utils/classnames';
import { formatDate } from '../../utils/dates';
import DateSlider from '../../components/DateSlider/DateSlider';
import { LendingPositions } from '../../components/LendingPositions/LendingPositions';
import { useEnanchedPools } from '../../hooks/useEnanchedPools';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { ParseMarkdown } from '../../components/ParseMarkdown/ParseMarkdown';
import { STATES } from '../../store/lending/lending.types';

type Props = {
  title: string;
  poolsConfig: string[];
};

const classesByState = {
  [STATES.ACTIVE]: 'bg-gradient-major-secondary-predominant',
  [STATES.PENDING]: 'bg-secondary',
  [STATES.CLOSED]: 'bg-primary',
  [STATES.LOCKED]: 'bg-primary',
};

export default function PoolsPage({ poolsConfig }: Props) {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const totalLoansIssued = useAppSelector(
    (state) => state.lending.totalDeposited,
  );

  const { t } = useTranslation();

  const { data: lendingPools, isLoading } = useEnanchedPools(poolsConfig);

  const currentLoans = formatBalanceCurrency(totalLoansIssued);

  return (
    <div className="flex flex-col">
      <section className="flex flex-wrap justify-between gap-4 text-xs md:text-inherit mt-6">
        <div className="flex gap-x-4 items-center w-full sm:w-fit flex-wrap">
          <div className="flex flex-col py-1">
            {!totalLoansIssued ? (
              <>
                <BoldSubDarkTextSkeleton />
                <BaseSubDarkTextSkeleton />
              </>
            ) : (
              <>
                <p className="font-bold text-primary text-base sm:text-xl">
                  <span>{currentLoans}</span>
                </p>
                <p className="flex text-base text-primary font-medium gap-x-1">
                  {t('currentLoans')}
                </p>
              </>
            )}
          </div>
          {/* <div className="flex flex-col py-1">
            {!10 ? (
              <>
                <BoldSubDarkTextSkeleton />
                <BaseSubDarkTextSkeleton />
              </>
            ) : (
              <>
                <p className="font-bold text-primary text-base sm:text-xl">
                  <span>
                    {formatBalance(22, defaultLocale, 2, 'standard')} USDC
                  </span>
                </p>
                <p className="flex text-base text-primary font-medium gap-x-1">
                  {t('avgLoanSize')}
                </p>
              </>
            )}
          </div> */}
        </div>
        {/* <div className="flex gap-x-2 items-center w-full sm:w-fit">
          <GradientBox>
            <>
              <p className="font-bold text-primary text-xl">
                <span>
                  {formatBalance(10, defaultLocale, 4, 'standard')} USDC
                </span>
              </p>
              <div className="flex text-base text-primary font-medium gap-x-1">
                {t('totalLoansIssued')}
              </div>
            </>
          </GradientBox>
          <GradientBox>
            <>
              <p className="font-bold text-primary text-xl">
                <span>
                  {formatBalance(10, defaultLocale, 4, 'standard')} USDC
                </span>
              </p>
              <div className="flex text-base text-sub-dark font-medium gap-x-1">
                {t('totalYields')}
              </div>
            </>
          </GradientBox>
        </div> */}
      </section>
      <LendingBanner />
      <LendingPositions />
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
        {!isLoading ? (
          !isEmpty(lendingPools) &&
          lendingPools?.map((pool, i) => {
            const currentState = Object.keys(STATES)
              .find(
                (key) =>
                  STATES[key as keyof typeof STATES] === pool?.lastEpoch?.state,
              )
              ?.toLowerCase();
            return (
              <Card
                key={i}
                className={classNames(
                  'bg-gradient-primary',
                  !pool?.attributes?.is_active &&
                    'opacity-50 pointer-events-none',
                )}
              >
                <CardHeader>
                  <div className="flex flex-1 gap-x-2 items-center">
                    <div className="flex flex-shrink-0 self-start">
                      {pool.attributes?.token?.data?.attributes?.icon?.data
                        ?.attributes?.url ? (
                        <Image
                          src={
                            pool.attributes?.token?.data?.attributes?.icon?.data
                              ?.attributes?.url
                          }
                          alt={
                            pool.attributes?.token?.data?.attributes?.icon?.data
                              ?.attributes?.alternativeText
                          }
                          width={36}
                          height={36}
                          priority
                        />
                      ) : null}
                    </div>
                    <div className="flex gap-y-1 gap-x-2 items-center justify-between w-full">
                      <CardTitle>{pool.attributes?.title}</CardTitle>
                      {pool?.lastActiveEpoch?.rate?.label ? (
                        <p className="text-base font-medium text-white bg-gradient-major-secondary-predominant rounded-xl px-2 py-1">
                          {t('poolAPR', {
                            apr: formatAsPercent(
                              pool?.lastActiveEpoch?.rate?.label,
                              defaultLocale,
                              2,
                            ),
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-1 gap-x-2 items-center">
                    <span
                      className={classNames(
                        'text-base text-white rounded-lg px-2 py-0.5',
                        classesByState[pool?.lastEpoch?.state],
                      )}
                    >
                      {t('poolStatus')}
                      {t(currentState)}
                    </span>
                    <DateSlider
                      initialDate={(() => {
                        const d = new Date();
                        d.setDate(d.getDate() - 10);
                        return d.getTime();
                      })()}
                      endDate={new Date(
                        pool.attributes?.date_until_next_state,
                      ).getTime()}
                    />
                  </div>
                </CardContent>
                <CardContent className="space-y-4">
                  <div className="flex relative overflow-hidden h-48 rounded-md items-center justify-center">
                    {pool.attributes?.card_image?.data?.attributes?.url ? (
                      <Image
                        src={pool.attributes?.card_image?.data?.attributes?.url}
                        alt="eth"
                        objectPosition={'top'}
                        objectFit={'cover'}
                        layout={'fill'}
                        priority
                      />
                    ) : null}
                    {pool.attributes?.pool_token_image?.data?.attributes
                      ?.url ? (
                      <div className="absolute">
                        <Image
                          src={
                            pool.attributes?.pool_token_image?.data?.attributes
                              ?.url
                          }
                          alt="eth"
                          width={200}
                          height={200}
                        />
                      </div>
                    ) : null}
                  </div>
                  <CardDescription>
                    <div className="text-primary bg-light-gray text-sm p-4 mt-1 rounded-md relative">
                      <div className="ml-auto flex absolute right-0 mr-4">
                        <Link
                          passHref
                          href={`/pools/${pool?.attributes?.address}`}
                        >
                          <motion.button
                            whileHover={{
                              scale: 1.05,
                              transition: { duration: 0.1 },
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="text-sm text-white font-medium flex items-center gap-x-2 bg-secondary px-3 py-1 rounded-full"
                          >
                            {t('goToPool')}
                            <ChevronRightIcon className="w-5 h-5" />
                          </motion.button>
                        </Link>
                      </div>
                      {ParseMarkdown(pool.attributes?.description)}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pool.attributes?.tags?.map(({ tag }, i) => (
                          <span
                            key={i}
                            className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <CardInfoList
                    className="text-primary bg-light-gray text-sm p-4 rounded-md"
                    infos={[
                      {
                        title: t('currentTotalSupply'),
                        value: (
                          <>
                            {formatBalance(
                              pool?.lastEpoch?.totalBorrow?.label,
                              defaultLocale,
                              2,
                              'standard',
                            )}{' '}
                            {pool?.attributes?.token?.data?.attributes?.symbol}
                          </>
                        ),
                      },
                      {
                        title: t('rewardsGenerated'),
                        value: (
                          <>
                            {pool?.lastEpoch?.forClaims?.label !== 0
                              ? `${formatBalance(
                                  pool?.lastEpoch?.forClaims?.label,
                                  defaultLocale,
                                  2,
                                  'standard',
                                )} ${
                                  pool?.attributes?.token?.data?.attributes
                                    ?.symbol
                                }`
                              : t('N/A')}
                          </>
                        ),
                      },
                      {
                        title: t('withdrawIn'),
                        value: (
                          <>
                            {formatDate(
                              pool.attributes?.date_until_next_state,
                              defaultLocale,
                            )}
                          </>
                        ),
                      },
                      {
                        title: t('startingDate'),
                        value: (
                          <>
                            {formatDate(
                              '2021-09-01T00:00:00.000Z',
                              defaultLocale,
                            )}
                          </>
                        ),
                      },
                    ]}
                  />
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}
      </section>
    </div>
  );
}

PoolsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    // does not seem to work with key `initialState`
    props: {
      title: 'Lending Pools',
      poolsConfig,
    },
  };
});
