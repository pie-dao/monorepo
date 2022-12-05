import { useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import Lock from '../Lock/Lock';
import { formatDate } from '../../utils/dates';
import classNames from '../../utils/classnames';
import { formatBalance } from '../../utils/formatBalance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useMemo } from 'react';

type Props = {
  title: string;
  subtitle: string;
  description: string;
  tokenOut: string;
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
  const { positions, loadingPositions } = useAppSelector(
    (state) => state.migration,
  );

  const memoizedPositions = useMemo(() => {
    if (!positions) return [];
    return positions?.filter((position) => position?.lockDuration !== 0) ?? [];
  }, [positions]);

  return (
    <div className="flex flex-col px-4 py-4 rounded-md bg-gradient-primary shadow-md bg gap-y-3 items-center divide-y w-full font-medium align-middle transition-all sm:max-w-2xl mx-auto">
      <div className="flex flex-col items-center w-full border-hidden gap-y-1">
        <h3 className="text-lg font-medium text-secondary">{t(title)}</h3>
        <p className="text-sm text-primary">{t(subtitle)}</p>
      </div>
      <div className="flex w-full flex-col pt-4 text-center">
        <p className="text-base text-secondary">{t(description)}</p>
        <div className="flex flex-col gap-y-2 mt-4 h-36 pr-4 overflow-y-scroll p-2">
          {loadingPositions && (
            <LoadingSpinner className="self-center h-full w-full" />
          )}
          {memoizedPositions &&
            memoizedPositions.length > 0 &&
            !loadingPositions &&
            memoizedPositions.map(({ amount, lockDuration, lockedAt }, i) => {
              return (
                <div
                  key={i}
                  className={classNames(
                    'w-full flex items-center gap-x-2 p-2 bg-light-gray shadow-md text-primary rounded-sm',
                    i !== 0 && isSingleLock && 'opacity-30',
                  )}
                >
                  <div className="flex flex-shrink-0 w-5 h-5">
                    <Lock isCompleted={false} />
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
                      {formatBalance(amount.label, defaultLocale, 4, 'compact')}{' '}
                      {t('DOUGH')}
                    </>
                  </p>
                </div>
              );
            })}
          {!loadingPositions && memoizedPositions.length === 0 && (
            <p className="text-center text-primary">{t('noMorePositions')}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full text-center pt-4">
        <button
          disabled={memoizedPositions.length === 0}
          onClick={goToStep}
          className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 flex gap-x-2 items-center justify-center"
        >
          {isSingleLock
            ? t('upgradeSingleLock', { token: tokenOut })
            : t('upgradeMultipleLocks', { token: tokenOut })}
        </button>
      </div>
    </div>
  );
};

export default MigrationCard;
