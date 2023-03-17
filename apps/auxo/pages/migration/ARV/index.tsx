import { ReactElement, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Layout } from '../../../components';
import { wrapper } from '../../../store';
import { useAppDispatch } from '../../../hooks';
import { ThunkGetVeDOUGHStakingData } from '../../../store/migration/migration.thunks';
import {
  thunkGetUserProductsData,
  thunkGetUserStakingData,
} from '../../../store/products/thunks';
import MigrationBackground from '../../../components/MigrationBackground/MigrationBackground';
import useMigrationSteps from '../../../hooks/migrationSteps';
import MigrationBanner from '../../../components/MigrationBanner/MigrationBanner';

export default function Migration({ token }: { token: 'PRV' | 'ARV' }) {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const getStep = useMigrationSteps(token);

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
      dispatch(thunkGetUserProductsData({ account }));
      dispatch(thunkGetUserStakingData({ account }));
    }
  }, [account, dispatch]);

  return (
    <div className="flex flex-col isolate relative">
      <MigrationBackground />
      <MigrationBanner />
      {getStep}
    </div>
  );
}

Migration.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    props: {
      title: 'migration',
      token: 'ARV',
    },
  };
});
