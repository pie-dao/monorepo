import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import { addMonths, formatDate, getRemainingMonths } from '../../utils/dates';
import classNames from '../../utils/classnames';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useCallback, useEffect, useMemo } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { setBoost } from '../../store/migration/migration.slice';
import Banner from '../Banner/Banner';
import { ExclamationIcon } from '@heroicons/react/outline';
import { isEmpty } from 'lodash';
import { useWeb3React } from '@web3-react/core';
import { useUpgradoor } from '../../hooks/useContracts';
import { ThunkPreviewMigration } from '../../store/migration/migration.thunks';
import PreviewMigration from '../veAUXOMigration/PreviewMigration';
import { MIGRATION_TYPE } from '../../store/migration/migration.types';
import MigratingPositions from '../MigrationPositions/MigrationPositions';
import { Wallet } from 'ethers';
import { useUserLockDuration } from '../../hooks/useToken';

type Props = {
  title: string;
  subtitle: string;
  tokenOut: 'veAUXO' | 'xAUXO';
  isSingleLock: boolean;
  goToStep: () => void;
};

const MigrationCard: React.FC<Props> = ({
  title,
  subtitle,
  tokenOut,
  isSingleLock,
  goToStep,
}) => {
  const { t } = useTranslation('migration');
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { positions, loadingPositions, boost } = useAppSelector(
    (state) => state.migration,
  );
  const { account } = useWeb3React();
  const dispatch = useAppDispatch();
  const upgradoor = useUpgradoor();
  const hasLock = !!useUserLockDuration('veAUXO');

  const memoizedPositions = useMemo(() => {
    if (isEmpty(positions)) return [];
    return positions?.filter((position) => position?.lockDuration !== 0) ?? [];
  }, [positions]);

  const remainingMonthsOnLongestPosition = useCallback(
    (boost: boolean) => {
      if (isEmpty(memoizedPositions)) return 0;
      if (boost) return 36;
      return getRemainingMonths(
        new Date(),
        new Date(
          memoizedPositions[0].lockedAt * 1000 +
            memoizedPositions[0].lockDuration * 1000,
        ),
      );
    },
    [memoizedPositions],
  );

  const setBoostSwitch = (boost: boolean) => {
    dispatch(setBoost(boost));
  };

  useEffect(() => {
    if (!account || typeof hasLock !== 'boolean') return;
    dispatch(
      ThunkPreviewMigration({
        destinationWallet: hasLock ? Wallet.createRandom().address : account,
        boost,
        token: tokenOut,
        isSingleLock,
        sender: account,
      }),
    );
  }, [dispatch, upgradoor, boost, isSingleLock, account, tokenOut, hasLock]);

  return (
    <div className="flex flex-col px-4 py-4 rounded-md bg-gradient-primary shadow-md bg gap-y-3 items-center w-full align-middle transition-all mx-auto max-w-4xl">
      <div className="flex flex-col items-center w-full border-hidden gap-y-1">
        <h3 className="text-lg font-medium text-secondary">{title}</h3>
        <p className="text-sm text-primary">{subtitle}</p>
      </div>
      {!loadingPositions ? (
        <>
          {' '}
          <MigratingPositions
            positions={memoizedPositions}
            isSingleLock={isSingleLock}
          />
          <PreviewMigration
            token={tokenOut}
            previewType={
              isSingleLock
                ? MIGRATION_TYPE.SINGLE_LOCK
                : boost && tokenOut === 'veAUXO'
                ? MIGRATION_TYPE.AGGREGATE_AND_BOOST
                : MIGRATION_TYPE.AGGREGATE
            }
            isSingleLock={isSingleLock}
          />
          {!isSingleLock && tokenOut === 'veAUXO' && (
            <div className="flex flex-col w-full justify-between gap-y-3">
              <div className="flex w-full justify-between px-4 py-2 bg-background shadow-md rounded-md">
                <label
                  className="pr-2 text-sub-dark font-medium"
                  htmlFor="boost"
                >
                  {t('boostToMax')}
                </label>
                <Switch.Root
                  className={classNames(
                    'group',
                    'flex bg-sub-dark relative items-center h-[15px] w-[36px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus-visible:ring focus-visible:ring-sub-dark focus-visible:ring-opacity-75',
                  )}
                  id="boost"
                  onCheckedChange={setBoostSwitch}
                  checked={boost}
                >
                  <Switch.Thumb
                    className={classNames(
                      'group-radix-state-checked:translate-x-4 group-radix-state-checked:bg-secondary',
                      'group-radix-state-unchecked:-translate-x-1 group-radix-state-unchecked:bg-sub-light',
                      'pointer-events-none flex h-[23px] w-[23px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out',
                    )}
                  />
                </Switch.Root>
              </div>
            </div>
          )}
          {!isEmpty(memoizedPositions) && tokenOut === 'veAUXO' && (
            <div className="flex w-full justify-between px-4 py-2 bg-background shadow-md rounded-md text-primary">
              <p>
                <span className="font-medium">{t('newLockTime')}:</span>{' '}
                {t('today')} -{' '}
                {formatDate(
                  addMonths(
                    remainingMonthsOnLongestPosition(
                      isSingleLock ? false : boost,
                    ),
                  ),
                  defaultLocale,
                )}
              </p>
              <p>
                <span className="text-primary font-medium">{t('months')}:</span>{' '}
                {remainingMonthsOnLongestPosition(isSingleLock ? false : boost)}
              </p>
            </div>
          )}
          {!isSingleLock && tokenOut === 'veAUXO' && (
            <div className="flex flex-col w-full">
              <Banner
                bgColor="bg-warning"
                content={t('withoutBoost')}
                icon={
                  <ExclamationIcon
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                }
              />
            </div>
          )}
          <div className="flex flex-col w-full text-center mt-auto">
            <button
              disabled={memoizedPositions.length === 0}
              onClick={goToStep}
              className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 disabled:text-sub-light disabled:ring-sub-light flex gap-x-2 items-center justify-center"
            >
              {isSingleLock
                ? t('upgradeSingleLock', { token: tokenOut })
                : t('upgradeMultipleLocks', { token: tokenOut })}
            </button>
          </div>{' '}
        </>
      ) : (
        <div className="h-96 w-full">
          <LoadingSpinner className="self-center h-full w-full" />
        </div>
      )}
    </div>
  );
};

export default MigrationCard;
