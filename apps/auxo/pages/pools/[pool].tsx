import { wrapper } from '../../store';
import pools from '../../config/lendingPools.json';
import { Layout } from '../../components';
import { ReactElement } from 'react';
import { useEnanchedPools } from '../../hooks/useEnanchedPools';
import { ClaimablePoolRewards } from '../../components/ClaimablePoolRewards/ClaimablePoolRewards';
import products from '../../config/products.json';
import { TokenConfig, TokensConfig } from '../../types/tokensConfig';
import Lend from '../../components/Lend/Lend';
import LendInfo from '../../components/Lend/LendInfo';
import { PoolCard } from '../../components/Card/CardVariants/PoolCard';
import classNames from '../../utils/classnames';
import { Card, CardContent, CardDebug } from '../../components/Card/Card';
import { STATES } from '../../store/lending/lending.types';
import { PREFERENCES } from '../../utils/constants';

type Props = {
  pool: string;
  tokenConfig: TokenConfig;
};

export default function PoolsPage({ pool, tokenConfig }: Props) {
  const { data: lendingPool, isLoading, isError } = useEnanchedPools(pool);
  console.log('lendingPool', lendingPool);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mt-6">
        <div className="xl:col-span-5">
          <ClaimablePoolRewards poolAddress={pool} />
        </div>
        <div className="xl:col-span-2 order-2 xl:order-1">
          <Lend tokenConfig={tokenConfig} poolAddress={pool} />
        </div>
        <div className="xl:col-span-3  order-1 xl:order-2 h-full">
          <LendInfo poolAddress={pool} />
        </div>
      </div>
      {!isLoading && !isError ? <PoolCard pool={lendingPool} /> : null}
      <Card className={classNames('bg-grsadient-primary flex-row')}>
        <CardContent className="gap-4 flex-col lg:flex-row flex">
          <CardDebug
            infos={
              [
                {
                  title: 'Last Epoch',
                  value: (
                    <ul>
                      <li className="text-secondary text-sm">
                        Available: {lendingPool?.lastEpoch?.available?.label}
                      </li>
                      <li className="text-secondary text-sm">
                        Pool State:{' '}
                        {Object.keys(STATES).find(
                          (key) =>
                            STATES[key as keyof typeof STATES] ===
                            lendingPool?.lastEpoch?.state,
                        )}
                      </li>
                      <li className="text-secondary text-sm">
                        MaxBorrow: {lendingPool?.lastEpoch?.maxBorrow?.label}
                      </li>
                      <li className="text-secondary text-sm">
                        Rate: {lendingPool?.lastEpoch?.rate?.label}
                      </li>
                      <li className="text-secondary text-sm">
                        forClaims: {lendingPool?.lastEpoch?.forClaims?.label}
                      </li>
                      <li className="text-secondary text-sm">
                        forWithdrawal:{' '}
                        {lendingPool?.lastEpoch?.forWithdrawal?.label}
                      </li>
                    </ul>
                  ),
                },
                {
                  title: 'Last Active Epoch',
                  value: (
                    <ul>
                      <li className="text-secondary text-sm">
                        Available:{' '}
                        {lendingPool?.lastActiveEpoch?.available?.label}
                      </li>
                      <li className="text-secondary text-sm">
                        Pool State:
                        {Object.keys(STATES).find(
                          (key) =>
                            STATES[key as keyof typeof STATES] ===
                            lendingPool?.lastActiveEpoch?.state,
                        )}
                      </li>
                      <li className="text-secondary text-sm">
                        MaxBorrow:{' '}
                        {lendingPool?.lastActiveEpoch?.maxBorrow?.label}
                      </li>
                      <li className="text-secondary text-sm">
                        Rate: {lendingPool?.lastActiveEpoch?.rate?.label}
                      </li>
                      <li className="text-secondary text-sm">
                        forClaims:{' '}
                        {lendingPool?.lastActiveEpoch?.forClaims?.label}
                      </li>
                      <li className="text-secondary text-sm">
                        forWithdrawal:{' '}
                        {lendingPool?.lastActiveEpoch?.forWithdrawal?.label}
                      </li>
                    </ul>
                  ),
                },
                {
                  title: 'User Data',
                  value: (
                    <ul>
                      <li className="text-secondary text-sm">
                        canWithdraw:{' '}
                        {lendingPool?.userData?.canWithdraw?.toString()}
                      </li>
                      <li className="text-secondary text-sm">
                        canClaim: {lendingPool?.userData?.canClaim?.toString()}
                      </li>
                      <li className="text-secondary text-sm">
                        canCompound:{' '}
                        {lendingPool?.userData?.canCompound?.toString()}
                      </li>
                      <li className="text-secondary text-sm">
                        Allowance: {lendingPool?.userData?.allowance?.label}
                      </li>
                      <li className="text-secondary text-sm">
                        Preference:{' '}
                        {Object.keys(PREFERENCES)
                          .find(
                            (key) =>
                              PREFERENCES[key as keyof typeof PREFERENCES] ===
                              lendingPool?.userData?.preference,
                          )
                          ?.toLowerCase() ?? ''}
                      </li>
                    </ul>
                  ),
                },
              ] as {
                title: string;
                value: JSX.Element;
              }[]
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

PoolsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(
  () =>
    async ({ params }) => {
      const { pool } = params;
      const productsConfig = products as TokensConfig;
      return {
        props: {
          pool,
          title: `Lending ${productsConfig['USDC'].name}`,
          icon: {
            src: '/tokens/32x32/usdc.png',
            alt: 'token',
            width: 32,
            height: 32,
          },
          tokenConfig: productsConfig['USDC'],
        },
      };
    },
);

export async function getStaticPaths() {
  return {
    paths: pools.map((address) => ({
      params: { pool: address },
    })),
    fallback: false,
  };
}
