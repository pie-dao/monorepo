import { useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import { useMemo } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { motion } from 'framer-motion';

type Props = {
  title: string;
  subtitle?: string;
};

const Heading: React.FC<Props> = ({ title, subtitle }) => {
  const { t } = useTranslation('migration');
  const { positions, loadingPositions } = useAppSelector(
    (state) => state.migration,
  );
  const memoizedLocks = useMemo(() => {
    return (
      positions?.filter((position) => position.lockDuration !== 0)?.length ?? 0
    );
  }, [positions]);

  return (
    <div className="flex flex-col items-center justify-center gap-y-3 my-8">
      <h1 className="text-4xl font-medium text-secondary text-center">
        {title}
      </h1>
      <p className="text-base text-center max-w-sm">{subtitle}</p>
      <motion.div
        layout
        className="flex px-2 py-1 bg-gradient-major-colors rounded-md text-white font-medium text-lg min-w-[20rem] min-h-[3rem] justify-center items-center"
      >
        <>
          {loadingPositions ? (
            <LoadingSpinner className="self-center h-full w-full" />
          ) : memoizedLocks === 0 ? (
            <motion.span className="flex">{t('noLocks')}</motion.span>
          ) : memoizedLocks === 1 ? (
            <motion.span className="flex">{t('oneLock')}</motion.span>
          ) : (
            <motion.span className="flex">
              {t('multipleLocks', { locks: memoizedLocks })}
            </motion.span>
          )}
        </>
      </motion.div>
    </div>
  );
};

export default Heading;
