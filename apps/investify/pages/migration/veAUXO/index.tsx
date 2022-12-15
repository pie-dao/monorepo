import { ReactElement, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Layout } from '../../../components';
import { wrapper } from '../../../store';
import ChooseMigration from '../../../components/veAUXOMigration/ChooseMigration';
import ConfirmMigration from '../../../components/veAUXOMigration/ConfirmMigration';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { STEPS_LIST } from '../../../store/migration/migration.types';
import SelectWalletMigration from '../../../components/SelectWalletMigration/SelectWalletMigration';
import { ThunkGetVeDOUGHStakingData } from '../../../store/migration/migration.thunks';
import MigrationCompleted from '../../../components/MigrationCompleted/MigrationCompleted';
import { thunkGetUserProductsData } from '../../../store/products/thunks';
import MigrationBackground from '../../../components/MigrationBackground/MigrationBackground';

export default function Migration({ token }: { token: 'xAUXO' | 'veAUXO' }) {
  const { currentStep } = useAppSelector((state) => state.migration);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
      dispatch(thunkGetUserProductsData({ account }));
    }
  }, [account, dispatch]);

  const getStep = useMemo(() => {
    switch (currentStep) {
      case STEPS_LIST.CHOOSE_MIGRATION_TYPE:
        return <ChooseMigration token={token} />;
      case STEPS_LIST.MIGRATE_SELECT_WALLET:
        return <SelectWalletMigration token={token} />;
      case STEPS_LIST.MIGRATE_CONFIRM:
        return <ConfirmMigration token={token} />;
      case STEPS_LIST.MIGRATE_SUCCESS:
        return <MigrationCompleted token={token} />;
      default:
        return null;
    }
  }, [currentStep, token]);

  return (
    <div className="flex flex-col h-screen isolate">
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
