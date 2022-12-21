import { useMemo } from 'react';
import { useAppSelector } from '.';
import MigrationCompleted from '../components/MigrationCompleted/MigrationCompleted';
import SelectWalletMigration from '../components/SelectWalletMigration/SelectWalletMigration';
import ChooseMigration from '../components/veAUXOMigration/ChooseMigration';
import ConfirmMigration from '../components/veAUXOMigration/ConfirmMigration';
import { STEPS_LIST } from '../store/migration/migration.types';

const useMigrationSteps = (token: 'xAUXO' | 'veAUXO') => {
  const { currentStep } = useAppSelector((state) => state.migration);

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

  return getStep;
};

export default useMigrationSteps;
