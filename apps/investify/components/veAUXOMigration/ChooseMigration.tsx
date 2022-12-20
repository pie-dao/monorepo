import useTranslation from 'next-translate/useTranslation';
import BackBar from '../BackBar/BackBar';
import Heading from '../Heading/Heading';
import MigrationCard from '../MigrationCard/MigrationCard';
import {
  setBoost,
  setCurrentStep,
  setDestinationWallet,
  setMigrationType,
  setPreviousStep,
  setSingleLock,
} from '../../store/migration/migration.slice';
import {
  STEPS_LIST,
  MIGRATION_TYPE,
} from '../../store/migration/migration.types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useWeb3React } from '@web3-react/core';
import { useTokenBalance } from '../../hooks/useToken';
import { isZero } from '../../utils/balances';

type Props = {
  token: 'veAUXO' | 'xAUXO';
};

const ChooseMigration: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation('migration');
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const noLocks = isZero(useTokenBalance(token), 18);
  const { boost } = useAppSelector((state) => state.migration);

  const nextStep = (isSingleLock: boolean) => {
    dispatch(setSingleLock(isSingleLock));
    dispatch(setPreviousStep(STEPS_LIST.CHOOSE_MIGRATION_TYPE));

    if (isSingleLock) {
      dispatch(setMigrationType(MIGRATION_TYPE.SINGLE_LOCK));
      dispatch(setCurrentStep(STEPS_LIST.MIGRATE_SELECT_WALLET));
      dispatch(setBoost(false));
    } else {
      if (token === 'veAUXO') {
        dispatch(
          setMigrationType(
            boost
              ? MIGRATION_TYPE.AGGREGATE_AND_BOOST
              : MIGRATION_TYPE.AGGREGATE,
          ),
        );
      } else {
        dispatch(setMigrationType(MIGRATION_TYPE.AGGREGATE));
      }
      dispatch(setDestinationWallet(account));
      dispatch(setCurrentStep(STEPS_LIST.MIGRATE_CONFIRM));
    }
  };

  const notVeAuxoOrNoLocks = token !== 'veAUXO' || noLocks;

  return (
    <>
      <Heading
        title={t('chooseHowToMigrate')}
        subtitle={t('chooseHowToMigrateSubtitle')}
      />
      <BackBar title={t('allOrOneByOne')} singleCard={!notVeAuxoOrNoLocks}>
        <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit mt-6">
          {notVeAuxoOrNoLocks && (
            <MigrationCard
              title={t('migrateMultipleLocks')}
              subtitle={t('migrateMultipleLocksSubtitle')}
              tokenOut={token}
              isSingleLock={false}
              goToStep={() => nextStep(false)}
            />
          )}
          <MigrationCard
            title={t('migrateOneLock')}
            subtitle={t('migrateOneLockSubtitle')}
            tokenOut={token}
            isSingleLock={true}
            goToStep={() => nextStep(true)}
          />
        </section>
      </BackBar>
    </>
  );
};

export default ChooseMigration;
