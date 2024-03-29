import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import { addMonths, formatDate, getRemainingMonths } from '../../utils/dates';
import classNames from '../../utils/classnames';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useCallback, useEffect, useMemo } from 'react';
import * as Switch from '@radix-ui/react-switch';
import {
  setBoost,
  setStake,
  setAggregateStake,
} from '../../store/migration/migration.slice';
import Banner from '../Banner/Banner';
import { ExclamationIcon } from '@heroicons/react/outline';
import { isEmpty } from 'lodash';
import { useConnectWallet } from '@web3-onboard/react';
import { useUpgradoor } from '../../hooks/useContracts';
import { ThunkPreviewMigration } from '../../store/migration/migration.thunks';
import PreviewMigration from '../veAUXOMigration/PreviewMigration';
import { MIGRATION_TYPE } from '../../store/migration/migration.types';
import MigratingPositions from '../MigrationPositions/MigrationPositions';
import { Wallet } from 'ethers';
import { useUserHasLock } from '../../hooks/useToken';

type Props = {
  title: string;
  subtitle: string;
  description?: string;
  tokenOut: 'ARV' | 'PRV';
  isSingleLock: boolean;
  goToStep: () => void;
};

const MigrationCard: React.FC<Props> = ({
  title,
  subtitle,
  description,
  tokenOut,
  isSingleLock,
  goToStep,
}) => {
  const { t } = useTranslation('migration');
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { positions, loadingPositions, boost, stake, aggregateStake } =
    useAppSelector((state) => state.migration);
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const dispatch = useAppDispatch();
  const upgradoor = useUpgradoor();
  const hasLock = useUserHasLock('ARV');

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

  const setStakeSwitch = useCallback(
    (stake: boolean) => {
      if (isSingleLock) {
        dispatch(setStake(stake));
      } else {
        dispatch(setAggregateStake(stake));
      }
    },
    [dispatch, isSingleLock],
  );

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
    <div className="flex flex-col px-4 py-4 rounded-md bg-gradient-primary shadow-sm bg gap-y-3 items-center w-full align-middle transition-all mx-auto max-w-2xl @container">
      <div className="flex flex-col items-center w-full border-hidden gap-y-1">
        <h3 className="text-lg font-medium text-secondary">{title}</h3>
        {subtitle && (
          <p className="text-sm text-primary min-h-[2rem] place-items-center text-center flex">
            {subtitle}
          </p>
        )}
      </div>
      {!loadingPositions ? (
        <>
          {' '}
          <MigratingPositions
            positions={memoizedPositions}
            isSingleLock={isSingleLock}
            className="mt-4"
          />
          <div className="flex flex-col w-full text-center text-sm text-primary min-h-[3rem] place-content-center">
            {description}
          </div>
          <PreviewMigration
            token={tokenOut}
            previewType={
              isSingleLock
                ? MIGRATION_TYPE.SINGLE_LOCK
                : boost && tokenOut === 'ARV'
                ? MIGRATION_TYPE.AGGREGATE_AND_BOOST
                : MIGRATION_TYPE.AGGREGATE
            }
            isSingleLock={isSingleLock}
          />
          {!isSingleLock && tokenOut === 'ARV' && (
            <div className="flex flex-col w-full justify-between gap-y-3">
              <div className="flex w-full justify-between px-4 py-2 bg-background rounded-md">
                <label
                  className="pr-2 text-sub-dark font-medium text-base"
                  htmlFor="boost"
                >
                  <span className="text-primary">{t('boostOn')}</span>
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
          {!isSingleLock && tokenOut === 'ARV' && (
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
          {!isEmpty(memoizedPositions) && tokenOut === 'ARV' && (
            <div className="flex w-full flex-col sm:flex-row justify-between px-4 py-2 bg-gradient-primary rounded-md text-primary gap-y-2">
              <p className="flex flex-col sm:flex-row">
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
              <p className="flex flex-col sm:flex-row">
                <span className="text-primary font-medium">{t('months')}:</span>{' '}
                {remainingMonthsOnLongestPosition(isSingleLock ? false : boost)}
              </p>
            </div>
          )}
          {tokenOut === 'PRV' && (
            <div className="flex flex-col w-full justify-between gap-y-3">
              <div className="flex w-full justify-between px-4 py-2 bg-background rounded-md">
                <label
                  className="pr-2 text-sub-dark font-medium text-base"
                  htmlFor="stake"
                >
                  <span className="text-primary">{t('stakeOn')}</span>
                </label>
                <Switch.Root
                  className={classNames(
                    'group',
                    'flex bg-sub-dark relative items-center h-[15px] w-[36px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus-visible:ring focus-visible:ring-sub-dark focus-visible:ring-opacity-75',
                  )}
                  id="stake"
                  onCheckedChange={setStakeSwitch}
                  checked={isSingleLock ? stake : aggregateStake}
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
          <div className="flex flex-col w-full text-center mt-auto">
            <button
              disabled={memoizedPositions.length === 0}
              onClick={goToStep}
              className="w-full @2xl:w-fit px-20 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 disabled:text-sub-light disabled:ring-sub-light flex gap-x-2 items-center justify-center mx-auto"
            >
              {isSingleLock
                ? t('upgradeSingleLock', { token: tokenOut }) +
                  (stake ? ' & Stake' : '')
                : t('upgradeMultipleLocks', { token: tokenOut }) +
                  (aggregateStake ? ' & Stake' : '')}
            </button>
          </div>
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
