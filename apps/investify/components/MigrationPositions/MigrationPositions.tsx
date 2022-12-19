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

export type MigratingPositionsProps = {
  positions: Position[];
  isSingleLock?: boolean;
};

const MigratingPositions: React.FC<MigratingPositionsProps> = ({
  positions,
  isSingleLock,
}) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { loadingPositions } = useAppSelector((state) => state.migration);
  const { t } = useTranslation('migration');
  return (
    <div className="flex w-full flex-col pt-4 text-center">
      <div className="flex flex-col gap-y-2 h-64 pr-4 overflow-y-auto p-2 scrollbar:w-[8px] scrollbar:bg-white scrollbar:border scrollbar:border-sub-dark scrollbar-track:bg-white scrollbar-thumb:bg-sub-light scrollbar-track:[box-shadow:inset_0_0_1px_rgba(0,0,0,0.4)] scrollbar-track:rounded-full scrollbar-thumb:rounded-full">
        {positions &&
          positions.length > 0 &&
          !loadingPositions &&
          positions.map(({ amount, lockDuration, lockedAt }, i) => {
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
                  'w-full flex items-center gap-x-2 p-2 bg-light-gray shadow-md text-primary rounded-sm @container',
                  i !== 0 && isSingleLock && 'opacity-30',
                )}
              >
                <div className="flex flex-shrink-0 w-5 h-5">
                  <Lock isCompleted={false} />
                </div>
                <div className="grid grid-cols-1 @lg:grid-cols-3 gap-x-2 text-xs justify-center flex-1">
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
                      <dd className="font-medium text-right">{lockedFor}</dd>
                    </dl>
                    <dl className="flex gap-1 justify-between">
                      <dt className="text-sub-dark">{t('remainingTime')}:</dt>
                      <dd className="font-medium text-right">
                        {remainingMonths}
                      </dd>
                    </dl>
                  </div>
                  <div className="flex my-auto">
                    <dt className="text-sub-dark @lg:hidden">{t('Amount')}:</dt>
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
        {!loadingPositions && positions.length === 0 && (
          <p className="text-center text-primary">{t('noMorePositions')}</p>
        )}
      </div>
    </div>
  );
};

export default MigratingPositions;
