import { Position } from '../../store/migration/migration.types';
import { useAppSelector } from '../../hooks';
import classNames from '../../utils/classnames';
import {
  formatDate,
  fromLockedAtToMonths,
  getRemainingMonths,
} from '../../utils/dates';
import { formatBalance } from '../../utils/formatBalance';
import useTranslation from 'next-translate/useTranslation';
import Lock from '../Lock/Lock';
import { useMemo } from 'react';

export type MigratingPositionsProps = {
  positions: Position[];
  isSingleLock?: boolean;
  showOnlyFirst?: boolean;
  className?: string;
};

const MigratingPositions: React.FC<MigratingPositionsProps> = ({
  positions,
  isSingleLock,
  showOnlyFirst,
  className,
}) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { loadingPositions } = useAppSelector((state) => state.migration);
  const { t } = useTranslation('migration');

  const positionsToShow = useMemo(() => {
    if (showOnlyFirst) {
      return positions.slice(0, 1);
    }
    return positions;
  }, [positions, showOnlyFirst]);

  return (
    <div className={classNames('flex w-full flex-col text-center', className)}>
      <div
        className={classNames(
          'flex flex-col gap-y-2 pr-2 overflow-y-auto  scrollbar:w-[8px] scrollbar:bg-white scrollbar:border scrollbar:border-sub-dark scrollbar-track:bg-white scrollbar-thumb:bg-sub-light scrollbar-track:[box-shadow:inset_0_0_1px_rgba(0,0,0,0.4)] scrollbar-track:rounded-full scrollbar-thumb:rounded-full',
          positionsToShow.length >= 4 ? 'h-64 p-2' : 'h-fit',
        )}
      >
        {positionsToShow &&
          positionsToShow.length > 0 &&
          !loadingPositions &&
          positionsToShow.map(({ amount, lockDuration, lockedAt }, i) => {
            const lockedAtFormatted = formatDate(
              lockedAt * 1000,
              defaultLocale,
            );
            const lockEndFormatted = formatDate(
              (lockedAt + lockDuration) * 1000,
              defaultLocale,
            );
            const lockedFor = fromLockedAtToMonths(lockDuration);
            const remainingMonths = getRemainingMonths(
              new Date(),
              new Date(lockedAt * 1000 + lockDuration * 1000),
            );
            return (
              <div
                key={i}
                className={classNames(
                  'w-full flex items-center gap-x-1 p-2 bg-light-gray shadow-md text-primary rounded-sm @container',
                  i !== 0 && isSingleLock && 'opacity-30',
                )}
              >
                <div className="flex flex-shrink-0 w-5 h-5">
                  <Lock isCompleted={false} />
                </div>
                <div className="grid grid-cols-1 @lg:grid-cols-[minmax(100px,_150px)_minmax(100px,_150px)_minmax(100px,_1fr)] gap-x-5 text-xs justify-center flex-1">
                  <div>
                    <dl className="flex gap-1 justify-between">
                      <dt className="text-sub-dark">{t('lockStart')}:</dt>
                      <dd className="font-medium text-right">
                        {lockedAtFormatted}
                      </dd>
                    </dl>
                    <dl className="flex gap-1 justify-between">
                      <dt className="text-sub-dark">{t('lockEnd')}:</dt>
                      <dd className="font-medium text-right">
                        {lockEndFormatted}
                      </dd>
                    </dl>
                  </div>
                  <div>
                    <dl className="flex gap-1 justify-between">
                      <dt className="text-sub-dark">{t('lockedFor')}:</dt>
                      <dd className="font-medium text-right">
                        {t('numOfMonths', { months: lockedFor })}
                      </dd>
                    </dl>
                    <dl className="flex gap-1 justify-between">
                      <dt className="text-sub-dark">{t('remainingTime')}:</dt>
                      <dd className="font-medium text-right">
                        {t('numOfMonths', { months: remainingMonths })}
                      </dd>
                    </dl>
                  </div>
                  <div className="flex my-auto">
                    <dt className="text-sub-dark @lg:hidden">{t('amount')}:</dt>
                    <dd className="ml-auto font-medium text-right">
                      <>
                        {formatBalance(
                          amount.label,
                          defaultLocale,
                          4,
                          'compact',
                        )}{' '}
                        {t('DOUGH')}
                      </>
                    </dd>
                  </div>
                </div>
              </div>
            );
          })}
        {!loadingPositions && positionsToShow.length === 0 && (
          <p className="text-center text-primary">{t('noMorePositions')}</p>
        )}
      </div>
    </div>
  );
};

export default MigratingPositions;
