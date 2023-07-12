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

type Props = {
  pool: string;
  tokenConfig: TokenConfig;
};

export default function PoolsPage({ pool, tokenConfig }: Props) {
  const { data: lendingPool, isLoading, isError } = useEnanchedPools(pool);

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
