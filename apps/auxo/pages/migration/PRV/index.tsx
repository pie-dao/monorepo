import { ReactElement, useEffect } from 'react';
import { Layout } from '../../../components';
import { wrapper } from '../../../store';
import { useAppDispatch } from '../../../hooks';
import { ThunkGetVeDOUGHStakingData } from '../../../store/migration/migration.thunks';
import { useConnectWallet } from '@web3-onboard/react';
import MigrationBackground from '../../../components/MigrationBackground/MigrationBackground';
import useMigrationSteps from '../../../hooks/migrationSteps';
import MigrationBanner from '../../../components/MigrationBanner/MigrationBanner';

export default function Migration({ token }: { token: 'PRV' | 'ARV' }) {
  const dispatch = useAppDispatch();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
    }
  }, [account, dispatch]);

  const getStep = useMigrationSteps(token);

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
      token: 'PRV',
    },
  };
});
