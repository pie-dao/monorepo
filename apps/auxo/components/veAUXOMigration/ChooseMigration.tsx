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
import { useConnectWallet } from '@web3-onboard/react';
import { useTokenBalance } from '../../hooks/useToken';
import { isZero } from '../../utils/balances';
import MigrationFAQ from '../MigrationFAQ/MigrationFAQ';
import { TOKEN_NAMES } from '../../utils/constants';

type Props = {
  token: 'ARV' | 'PRV';
};

const ChooseMigration: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation('migration');
  const dispatch = useAppDispatch();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
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
      if (token === 'ARV') {
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
  const notVeAuxoOrNoLocks = token !== 'ARV' || noLocks;

  return (
    <>
      <Heading
        title={t('chooseHowToMigrate')}
        subtitle="chooseHowToMigrateSubtitle"
      />
      <BackBar
        title={!notVeAuxoOrNoLocks ? t('oneByOne') : t('allOrOneByOne')}
        singleCard={!notVeAuxoOrNoLocks}
      >
        <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit mt-6">
          {notVeAuxoOrNoLocks && (
            <MigrationCard
              title={t('migrateMultipleLocks')}
              subtitle={t('migrateMultipleLocksSubtitle', {
                token: TOKEN_NAMES[token],
              })}
              description={t('migrateMultipleLocksDescription')}
              tokenOut={token}
              isSingleLock={false}
              goToStep={() => nextStep(false)}
            />
          )}
          <MigrationCard
            title={t('migrateOneLock')}
            subtitle={t('migrateOneLockSubtitle', {
              token: TOKEN_NAMES[token],
            })}
            tokenOut={token}
            isSingleLock={true}
            goToStep={() => nextStep(true)}
          />
        </section>
      </BackBar>
      <MigrationFAQ />
    </>
  );
};

export default ChooseMigration;
