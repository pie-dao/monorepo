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
import { useUpgradoor } from '../../../hooks/useContracts';

export default function Migration({ token }: { token: 'xAUXO' | 'veAUXO' }) {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const getStep = useMigrationSteps(token);
  const upgradoor = useUpgradoor();

  useEffect(() => {
    if (account && upgradoor) {
      dispatch(ThunkGetVeDOUGHStakingData({ account, upgradoor }));
      dispatch(thunkGetUserProductsData({ account }));
      dispatch(thunkGetUserStakingData({ account }));
    }
  }, [account, dispatch, upgradoor]);

  return (
    <div className="flex flex-col isolate relative">
      <MigrationBackground />
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
      token: 'veAUXO',
    },
  };
});
