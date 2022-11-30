import { ReactElement, useEffect } from 'react';
import { Layout } from '../../../components';
import { wrapper } from '../../../store';
import ChooseMigration from '../../../components/veAUXOMigration/ChooseMigration';
import ConfirmMigration from '../../../components/veAUXOMigration/ConfirmMigration';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { STEPS_LIST } from '../../../store/migration/migration.types';
import SelectWalletMigration from '../../../components/SelectWalletMigration/SelectWalletMigration';
import { ThunkGetVeDOUGHStakingData } from '../../../store/migration/migration.thunks';
import { useWeb3React } from '@web3-react/core';

export default function Migration() {
  const { currentStep } = useAppSelector((state) => state.migration);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
    }
  }, [account, dispatch]);

  const getStep = () => {
    switch (currentStep) {
      case +STEPS_LIST.CHOOSE_MIGRATION_TYPE_VE_AUXO:
        return <ChooseMigration />;
      case +STEPS_LIST.AGGREGATE_ALL_LOCKS_VE_AUXO:
        return <SelectWalletMigration />;
      case +STEPS_LIST.AGGREGATE_ALL_LOCKS_VE_AUXO_CONFIRM:
        return <ConfirmMigration />;
      default:
        return <ChooseMigration />;
    }
  };

  return <div className="flex flex-col h-screen">{getStep()}</div>;
}

Migration.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    // does not seem to work with key `initialState`
    props: {
      title: 'Migration',
    },
  };
});
