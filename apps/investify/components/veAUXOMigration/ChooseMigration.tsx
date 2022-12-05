import useTranslation from 'next-translate/useTranslation';
import BackBar from '../BackBar/BackBar';
import Heading from '../Heading/Heading';
import MigrationCard from '../MigrationCard/MigrationCard';
import {
  setCurrentStep,
  setDestinationWallet,
  setPreviousStep,
  setSingleLock,
} from '../../store/migration/migration.slice';
import { STEPS_LIST } from '../../store/migration/migration.types';
import { useAppDispatch } from '../../hooks';
import { useWeb3React } from '@web3-react/core';
import { useTokenBalance } from '../../hooks/useToken';
import { isZero } from '../../utils/balances';

type Props = {
  token: string;
};

const ChooseMigration: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation('migration');
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const noLocks = isZero(useTokenBalance(token), 18);

  const nextStep = (isSingleLock: boolean) => {
    dispatch(setSingleLock(isSingleLock));
    dispatch(setPreviousStep(STEPS_LIST.CHOOSE_MIGRATION_TYPE));
    if (isSingleLock) {
      dispatch(setCurrentStep(STEPS_LIST.MIGRATE_SELECT_WALLET));
    } else {
      dispatch(setDestinationWallet(account));
      dispatch(setCurrentStep(STEPS_LIST.MIGRATE_CONFIRM));
    }
  };

  const notVeAuxoOrNoLocks = token !== 'veAUXO' && !noLocks;

  return (
    <>
      <Heading
        title={t('timeToMigrate')}
        subtitle={t('timeToMigrateSubtitle')}
      />
      <BackBar />
      <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit mt-6">
        {notVeAuxoOrNoLocks && (
          <MigrationCard
            title={t('migrateMultipleLocks')}
            description={t('migrateMultipleLocksDescription')}
            subtitle={t('migrateMultipleLocksSubtitle')}
            tokenOut={token}
            isSingleLock={false}
            goToStep={() => nextStep(false)}
          />
        )}
        <MigrationCard
          title={t('migrateOneLock')}
          description={t('migrateOneLockDescription')}
          subtitle={t('migrateOneLockSubtitle')}
          tokenOut={token}
          isSingleLock={true}
          goToStep={() => nextStep(true)}
        />
      </section>
    </>
  );
};

export default ChooseMigration;
