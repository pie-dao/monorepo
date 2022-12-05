import { useEffect, useMemo, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import BackBar from '../BackBar/BackBar';
import Heading from '../Heading/Heading';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { formatDate } from '../../utils/dates';
import classNames from '../../utils/classnames';
import Lock from '../Lock/Lock';
import { useUpgradoor } from '../../hooks/useContracts';
import {
  ThunkMigrateVeDOUGH,
  ThunkPreviewMigration,
} from '../../store/migration/migration.thunks';
import { formatBalance } from '../../utils/formatBalance';
import * as Switch from '@radix-ui/react-switch';
import { STEPS_LIST } from '../../store/migration/migration.types';
import { useWeb3React } from '@web3-react/core';
import Image from 'next/image';
import PreviewMigration from './PreviewMigration';

type Props = {
  token: 'veAUXO' | 'xAUXO';
};

const ConfirmMigration: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation('migration');
  const { account } = useWeb3React();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { destinationWallet, positions, loadingPositions, isSingleLock } =
    useAppSelector((state) => state.migration);
  const dispatch = useAppDispatch();
  const upgradoor = useUpgradoor();
  const [boost, setBoost] = useState<boolean>(false);

  const memoizedPositions = useMemo(() => {
    if (!positions) return [];
    return positions?.filter((position) => position?.lockDuration !== 0) ?? [];
  }, [positions]);

  const handleConfirm = async () => {
    dispatch(
      ThunkMigrateVeDOUGH({
        upgradoor,
        destinationWallet,
        boost,
        token,
        isSingleLock,
      }),
    );
  };

  useEffect(() => {
    dispatch(
      ThunkPreviewMigration({
        upgradoor,
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

  return (
    <>
      <Heading
        title={t('timeToMigrate')}
        subtitle={t('timeToMigrateSubtitle')}
      />
      <BackBar
        token={token}
        goTo={
          isSingleLock
            ? STEPS_LIST.MIGRATE_SELECT_WALLET
            : STEPS_LIST.CHOOSE_MIGRATION_TYPE
        }
      />
      <section className="grid grid-cols-1 items-center gap-4 text-xs md:text-inherit mt-6">
        <div className="align-middle sm:max-w-2xl mx-auto flex flex-col px-4 py-4 rounded-md bg-gradient-primary shadow-md bg gap-y-3 items-center divide-y w-full font-medium">
          <div className="flex flex-col items-center w-full border-hidden gap-y-1">
            <h3 className="text-lg font-medium text-secondary">
              {t('veDOUGHToToken', { tokenOut: token })}
            </h3>
          </div>
          <div className="flex w-full flex-col text-center">
            <div className="flex flex-col gap-y-2 mt-2 max-h-40 pr-4 overflow-y-scroll">
              {memoizedPositions &&
                memoizedPositions.length > 0 &&
                !loadingPositions &&
                memoizedPositions.map(
                  ({ amount, lockDuration, lockedAt }, i) => {
                    return (
                      <div
                        key={i}
                        className={classNames(
                          'flex items-center gap-x-2 p-2 bg-secondary shadow-md text-white rounded-md',
                          i !== 0 && isSingleLock && 'opacity-30',
                        )}
                      >
                        <div className="flex flex-shrink-0 w-5 h-5">
                          <Lock fill="#ffffff" isCompleted={false} />
                        </div>
                        <p className="font-normal">
                          <span className="font-medium">{t('vested')}</span>:{' '}
                          {formatDate(lockedAt * 1000, defaultLocale)}
                        </p>
                        <p className="font-normal">
                          <span className="font-medium">{t('end')}</span>:{' '}
                          {formatDate(
                            lockedAt * 1000 + lockDuration * 1000,
                            defaultLocale,
                          )}
                        </p>
                        <p className="ml-auto font-medium">
                          <>
                            {formatBalance(
                              amount.label,
                              defaultLocale,
                              4,
                              'standard',
                            )}{' '}
                            {t('DOUGH')}
                          </>
                        </p>
                      </div>
                    );
                  },
                )}
            </div>
          </div>
          <div className="flex flex-col w-full pt-4 pr-4">
            <div className="flex w-full justify-between px-4 py-2 bg-background shadow-md rounded-md">
              <p className="text-primary text-base font-medium truncate">
                {t('common:wallet')}: <span>{destinationWallet}</span>
              </p>
            </div>
          </div>
          {token === 'xAUXO' && (
            <div className="flex flex-col w-full pt-4 pr-4">
              <div className="flex w-full justify-between px-4 py-2 bg-background shadow-md rounded-md">
                <p>{t('common:noStakeTime')}</p>
                <p className="text-secondary font-medium text-md">
                  {t('common:keepLiquidity')}
                </p>
              </div>
            </div>
          )}
          {!isSingleLock && token === 'veAUXO' && (
            <div className="flex flex-col w-full justify-between pr-4 py-2">
              <div className="text-center text-sub-dark font-medium text-sm py-4">
                <p>{t('withoutBoost')}</p>
              </div>
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
                    'flex bg-sub-dark relative items-center h-[15px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus-visible:ring focus-visible:ring-sub-dark focus-visible:ring-opacity-75',
                  )}
                  id="boost"
                  onCheckedChange={setBoost}
                  checked={boost}
                >
                  <Switch.Thumb
                    className={classNames(
                      'group-radix-state-checked:translate-x-6',
                      'group-radix-state-unchecked:-translate-x-1',
                      'pointer-events-none flex h-[23px] w-[23px] transform rounded-full bg-secondary shadow-lg ring-0 transition duration-200 ease-in-out',
                    )}
                  />
                </Switch.Root>
              </div>
            </div>
          )}
          <PreviewMigration token={token} />
          <div className="flex flex-col w-full text-center pt-4">
            <button
              onClick={handleConfirm}
              className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 flex gap-x-2 items-center justify-center"
            >
              {t('confirmAndUpgrade')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfirmMigration;
