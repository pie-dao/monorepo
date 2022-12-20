import { useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { AnimatePresence, motion } from 'framer-motion';
import { Popover } from '@headlessui/react';
import DOUGHIcon from '../../public/tokens/DOUGH.png';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Lock from '../Lock/Lock';
import {
  formatDate,
  fromLockedAtToMonths,
  getRemainingMonths,
} from '../../utils/dates';
import classNames from '../../utils/classnames';
import { formatBalance } from '../../utils/formatBalance';
import { usePopper } from 'react-popper';

type Props = {
  title: string;
  subtitle?: string;
};

const Heading: React.FC<Props> = ({ title, subtitle }) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  const { t } = useTranslation('migration');
  const { positions, loadingPositions } = useAppSelector(
    (state) => state.migration,
  );
  const { defaultLocale } = useAppSelector((state) => state.preferences);

  const memoizedLocks = useMemo(() => {
    if (!positions) return [];
    return positions?.filter((position) => position?.lockDuration !== 0) ?? [];
  }, [positions]);

  return (
    <div className="flex flex-col items-center justify-center gap-y-10 mt-16 mb-20">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-4xl font-medium text-secondary text-center">
          {title}
        </h1>
        <p className="text-base text-center max-w-2xl text-primary font-medium mx-auto">
          {subtitle}
        </p>
      </div>

      <Popover
        as="div"
        className="bg-white shadow-md rounded-lg py-2 w-full max-w-xl relative"
      >
        {({ open }) => (
          <>
            <Popover.Button
              as="div"
              className={classNames(
                'cursor-pointer w-full px-2',
                memoizedLocks?.length === 0 && 'pointer-events-none',
              )}
              ref={setReferenceElement}
            >
              <div className="flex items-center">
                <div className="w-full flex-1 flex items-start justify-center gap-x-2 text-primary font-medium text-lg">
                  {!loadingPositions && (
                    <div className="flex flex-shrink-0 self-center">
                      <Image
                        src={DOUGHIcon}
                        alt={'DOUGH'}
                        height={24}
                        width={24}
                      />
                    </div>
                  )}
                  <>
                    {loadingPositions ? (
                      <LoadingSpinner className="self-center h-full w-full" />
                    ) : memoizedLocks?.length === 0 ? (
                      <motion.span className="flex">{t('noLocks')}</motion.span>
                    ) : memoizedLocks?.length === 1 ? (
                      <motion.span className="flex">{t('oneLock')}</motion.span>
                    ) : (
                      <motion.span className="flex">
                        {t('multipleLocks', { locks: memoizedLocks?.length })}
                      </motion.span>
                    )}
                  </>
                </div>
                {memoizedLocks?.length !== 0 && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                  >
                    <ChevronDownIcon
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </motion.div>
                )}
              </div>
            </Popover.Button>
            <AnimatePresence initial={false}>
              {open && (
                <Popover.Panel
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                  as={motion.div}
                  initial="collapsed"
                  animate="open"
                  static
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: 'auto' },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="bg-white rounded-b-lg overflow-hidden absolute z-10 w-full p-2"
                >
                  <motion.div
                    variants={{
                      collapsed: { scale: 0.8 },
                      open: { scale: 1 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="origin-top space-y-3 max-h-52 overflow-y-auto p-4 scrollbar:w-[8px] scrollbar:bg-white scrollbar:border scrollbar:border-sub-dark scrollbar-track:bg-white scrollbar-thumb:bg-sub-light scrollbar-track:[box-shadow:inset_0_0_1px_rgba(0,0,0,0.4)] scrollbar-track:rounded-full scrollbar-thumb:rounded-full"
                  >
                    {memoizedLocks &&
                      memoizedLocks.length > 0 &&
                      !loadingPositions &&
                      memoizedLocks.map(
                        ({ amount, lockDuration, lockedAt }, i) => {
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
                              )}
                            >
                              <div className="flex flex-shrink-0 w-5 h-5">
                                <Lock isCompleted={false} />
                              </div>
                              <div className="grid grid-cols-1 @md:grid-cols-3 gap-x-2 text-xs justify-center flex-1">
                                <div>
                                  <dl className="flex gap-1 justify-between">
                                    <dt className="text-sub-dark">
                                      {t('lockStart')}:
                                    </dt>
                                    <dd className="font-medium text-right">
                                      {lockedAtFormatted}
                                    </dd>
                                  </dl>
                                  <dl className="flex gap-1 justify-between">
                                    <dt className="text-sub-dark">
                                      {t('lockEnd')}:
                                    </dt>
                                    <dd className="font-medium text-right">
                                      {lockEndFormatted}
                                    </dd>
                                  </dl>
                                </div>
                                <div>
                                  <dl className="flex gap-1 justify-between">
                                    <dt className="text-sub-dark">
                                      {t('lockedFor')}:
                                    </dt>
                                    <dd className="font-medium text-right">
                                      {lockedFor}
                                    </dd>
                                  </dl>
                                  <dl className="flex gap-1 justify-between">
                                    <dt className="text-sub-dark">
                                      {t('remainingTime')}:
                                    </dt>
                                    <dd className="font-medium text-right">
                                      {remainingMonths}
                                    </dd>
                                  </dl>
                                </div>
                                <div className="flex my-auto">
                                  <dt className="text-sub-dark @md:hidden">
                                    {t('amount')}:
                                  </dt>
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
                        },
                      )}
                  </motion.div>
                </Popover.Panel>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
    </div>
  );
};

export default Heading;
