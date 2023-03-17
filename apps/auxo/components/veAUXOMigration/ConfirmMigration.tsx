import { useEffect, useMemo, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import BackBar from '../BackBar/BackBar';
import Heading from '../Heading/Heading';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  addMonths,
  formatDate,
  fromLockedAtToMonths,
  getRemainingMonths,
} from '../../utils/dates';
import classNames from '../../utils/classnames';
import { useUpgradoor } from '../../hooks/useContracts';
import {
  ThunkMigrateVeDOUGH,
  ThunkPreviewMigration,
} from '../../store/migration/migration.thunks';
import { formatBalance, toBalance } from '../../utils/formatBalance';
import { STEPS_LIST } from '../../store/migration/migration.types';
import { useWeb3React } from '@web3-react/core';
import PreviewMigration from './PreviewMigration';
import {
  MigrationRecap,
  MigrationRecapProps,
} from '../MigrationRecap/MigrationRecap';
import { addBalances } from '../../utils/balances';
import { BigNumber } from 'ethers';
import { isEmpty } from 'lodash';
import trimAccount from '../../utils/trimAccount';
import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Label from '@radix-ui/react-label';
import { CheckIcon, ExclamationIcon } from '@heroicons/react/outline';
import Banner from '../Banner/Banner';
import Trans from 'next-translate/Trans';
import MigratingPositions from '../MigrationPositions/MigrationPositions';
import { setConvertedDOUGHLabel } from '../../store/migration/migration.slice';
import MigrationFAQ from '../MigrationFAQ/MigrationFAQ';
import { TOKEN_NAMES } from '../../utils/constants';

type Props = {
  token: 'ARV' | 'PRV';
};

export function getMigratingTo(token: string, boost: boolean): string {
  if (token !== 'ARV') return 'PRV';
  if (!boost) return 'oneLockOutput';
  else return 'oneBoostedLockOutput';
}

export function getLevel(input: number): number {
  if (input < 6) return 0;
  return input - 6;
}

const ConfirmMigration: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation('migration');
  const { account } = useWeb3React();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const {
    destinationWallet,
    positions,
    isSingleLock,
    boost,
    migrationType,
    estimatedOutput,
  } = useAppSelector((state) => state.migration);

  const entryFee = useAppSelector(
    (state) => state.dashboard?.tokens['PRV']?.fee?.label,
  );

  const dispatch = useAppDispatch();
  const upgradoor = useUpgradoor();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const memoizedPositions = useMemo(() => {
    if (isEmpty(positions)) return [];
    return positions?.filter((position) => position?.lockDuration !== 0) ?? [];
  }, [positions]);

  const handleConfirm = async () => {
    dispatch(
      setConvertedDOUGHLabel(
        formatBalance(totalDOUGHConverted, defaultLocale, 4, 'standard'),
      ),
    );
    dispatch(
      ThunkMigrateVeDOUGH({
        upgradoor,
        destinationWallet,
        boost,
        token,
        isSingleLock,
        sender: account,
      }),
    );
  };

  useEffect(() => {
    if (!destinationWallet || !account) return;
    dispatch(
      ThunkPreviewMigration({
        destinationWallet,
        boost,
        token,
        isSingleLock,
        sender: account,
      }),
    );
  }, [
    dispatch,
    upgradoor,
    destinationWallet,
    boost,
    token,
    isSingleLock,
    account,
  ]);

  const totalDOUGHConverted = useMemo(() => {
    if (isEmpty(positions)) return 0;
    if (isSingleLock) return memoizedPositions[0].amount.label;
    return memoizedPositions.reduce(
      (acc, position) => addBalances(acc, position.amount),
      toBalance(BigNumber.from(0), 18),
    ).label;
  }, [isSingleLock, memoizedPositions, positions]);

  const textForMigrationType = useMemo(() => {
    const baseText = token === 'ARV' ? 'MigrationARV' : 'MigrationPRV';
    const boostText = token === 'ARV' && boost ? 'Boost' : '';
    const lockText = isSingleLock ? 'singleLock' : 'multipleLocks';
    return t(`${lockText}${baseText}${boostText}`, {
      boostLevel: getLevel(
        getRemainingMonths(
          new Date(),
          new Date(
            memoizedPositions[0].lockedAt * 1000 +
              memoizedPositions[0].lockDuration * 1000,
          ),
        ),
      ),
    });
  }, [token, boost, isSingleLock, t, memoizedPositions]);

  const migrationRecapContent = useMemo<MigrationRecapProps>(() => {
    if (!memoizedPositions) return null;
    const migrationTypeText = textForMigrationType;
    const totalOutput = `${formatBalance(
      estimatedOutput?.[token]?.[migrationType]?.label,
      defaultLocale,
      4,
      'standard',
    )}${' '} ${TOKEN_NAMES[token]}`;
    const totalDOUGH = formatBalance(
      totalDOUGHConverted,
      defaultLocale,
      4,
      'standard',
    );
    const locks = {
      numberOfLocks: isSingleLock ? 1 : memoizedPositions.length,
      totalMigrating: totalDOUGH,
      migratingTo: t(getMigratingTo(token, boost)),
    };

    const preview = {
      from: totalDOUGH,
      to: formatBalance(
        totalDOUGHConverted / 100,
        defaultLocale,
        4,
        'standard',
      ),
    };

    const newLockDuration =
      token === 'ARV'
        ? boost
          ? 36
          : getRemainingMonths(
              new Date(),
              new Date(
                memoizedPositions[0].lockedAt * 1000 +
                  memoizedPositions[0].lockDuration * 1000,
              ),
            )
        : null;

    const willReceive = {
      AUXO: formatBalance(
        totalDOUGHConverted / 100,
        defaultLocale,
        4,
        'standard',
      ),
      estimatedOutput: totalOutput,
    };

    const receiver = trimAccount(destinationWallet, true);
    const newLockEnd =
      token === 'ARV'
        ? formatDate(addMonths(newLockDuration), defaultLocale)
        : null;

    const oldLockDuration = fromLockedAtToMonths(
      memoizedPositions[0].lockDuration,
    );

    const fee = formatBalance(entryFee, defaultLocale, 4, 'standard');

    return {
      migrationType: migrationTypeText,
      locks,
      preview,
      willReceive,
      receiver,
      newLockDuration,
      newLockEnd,
      oldLockDuration,
      token,
      fee,
    };
  }, [
    textForMigrationType,
    estimatedOutput,
    token,
    migrationType,
    defaultLocale,
    totalDOUGHConverted,
    isSingleLock,
    boost,
    t,
    memoizedPositions,
    destinationWallet,
    entryFee,
  ]);

  return (
    <>
      <Heading
        title={t('reviewAndConfirm')}
        subtitle="reviewAndConfirmSubtitle"
      />
      <BackBar
        token={token}
        goTo={
          isSingleLock
            ? STEPS_LIST.MIGRATE_SELECT_WALLET
            : STEPS_LIST.CHOOSE_MIGRATION_TYPE
        }
        title={t('confirmToUpgrade')}
        singleCard={true}
      >
        <section className="grid grid-cols-1 items-center gap-4 text-base md:text-inherit sm:max-w-7xl w-full">
          <div className="align-middle flex flex-col gap-y-3 items-center font-medium">
            <div className="flex flex-col items-center gap-y-1">
              <h3 className="text-lg font-medium text-secondary">
                {t('veDOUGHToToken', { tokenOut: token })}
              </h3>
            </div>
            <MigratingPositions
              positions={memoizedPositions}
              isSingleLock={isSingleLock}
              showOnlyFirst={isSingleLock}
            />
            <div className="flex w-full">
              <PreviewMigration
                token={token}
                previewType={migrationType}
                isSingleLock={isSingleLock}
              />
            </div>
            <MigrationRecap {...migrationRecapContent} />
            <div className="flex items-center justify-center w-full text-center pt-4">
              <Checkbox.Root
                id="c1"
                checked={isTermsAccepted}
                onCheckedChange={() => setIsTermsAccepted(!isTermsAccepted)}
                className={classNames(
                  'flex h-5 w-5 items-center justify-center rounded pointer',
                  'radix-state-checked:bg-secondary radix-state-unchecked:bg-light-gray ring-2 ring-offset-2 ring-secondary',
                  'focus:outline-none focus-visible:ring focus-visible:ring-opacity-75',
                )}
              >
                <Checkbox.Indicator>
                  <CheckIcon className="h-4 w-4 self-center text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Label.Label
                htmlFor="c1"
                className="ml-3 select-none text-sm font-medium text-primary cursor-pointer"
              >
                {t('termsOfMigration')}
              </Label.Label>
            </div>
            <div className="flex flex-col w-full text-center pt-4">
              <button
                disabled={!isTermsAccepted}
                onClick={handleConfirm}
                className=" mx-auto w-fit px-20 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 disabled:text-sub-light disabled:ring-sub-light flex gap-x-2 items-center justify-center"
              >
                {t('confirmAndUpgrade')}
              </button>
            </div>
          </div>
        </section>
      </BackBar>
      <MigrationFAQ />
    </>
  );
};

export default ConfirmMigration;
