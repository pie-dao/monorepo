import useTranslation from 'next-translate/useTranslation';
import BackBar from '../BackBar/BackBar';
import Heading from '../Heading/Heading';
import MigrationCard from '../MigrationCard/MigrationCard';
import {
  setCurrentStep,
  setPreviousStep,
} from '../../store/migration/migration.slice';
import { STEPS_LIST } from '../../store/migration/migration.types';
import { useAppDispatch } from '../../hooks';

const ChooseMigration: React.FC = () => {
  const { t } = useTranslation('migration');
  const dispatch = useAppDispatch();

  const goToAllLocks = () => {
    dispatch(setPreviousStep(STEPS_LIST.CHOOSE_MIGRATION_TYPE_VE_AUXO));
    dispatch(setCurrentStep(STEPS_LIST.CHOOSE_MIGRATION_TYPE_VE_AUXO + 1));
  };

  return (
    <>
      <Heading
        title={t('timeToMigrate')}
        subtitle={t('timeToMigrateSubtitle')}
      />
      <BackBar token="veAUXO" />
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-xs md:text-inherit mt-6">
        <MigrationCard
          title={t('migrateMultipleLocks')}
          description={t('migrateMultipleLocksDescription')}
          subtitle={t('migrateMultipleLocksSubtitle')}
          tokenOut="veAUXO"
          isSingleLock={false}
          goToStep={goToAllLocks}
        />
        <MigrationCard
          title={t('migrateOneLock')}
          description={t('migrateOneLockDescription')}
          subtitle={t('migrateOneLockSubtitle')}
          tokenOut="veAUXO"
          isSingleLock={true}
          goToStep={() => null}
        />
      </section>
    </>
  );
};

export default ChooseMigration;
