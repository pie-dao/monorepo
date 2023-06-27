import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import { useEnanchedPools } from '../../hooks/useEnanchedPools';
import { isEmpty } from 'lodash';
import { convertedEpoch } from '../../store/lending/lending.types';

export const EpochsHistory = ({ poolAddress }: { poolAddress: string }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useEnanchedPools();
  if (isLoading || isError || isEmpty(data)) return null;
  const pool = data.find(
    (position) => position?.attributes?.address === poolAddress,
  );

  return (
    <Disclosure
      as="div"
      className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden"
      defaultOpen
    >
      {({ open }) => (
        <>
          <Disclosure.Button as="div" className="cursor-pointer">
            <div className="flex items-center">
              <div className="min-w-0 flex-1 flex items-center">
                <h3 className="text-lg font-medium text-primary flex gap-x-2 items-center justify-center">
                  {t('epochs')}
                  <span className="text-xs text-white bg-gradient-major-secondary-predominant rounded-full px-2 py-0.5">
                    {pool?.epochs?.length}
                  </span>
                </h3>
              </div>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <ChevronDownIcon
                  className="h-7 w-7 text-primary"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </Disclosure.Button>
          <AnimatePresence initial={false}>
            {open && (
              <Disclosure.Panel
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
                className="rounded-lg overflow-hidden"
              >
                <div className="w-full flex flex-col">
                  <div className="flex flex-col mt-2 gap-y-2">
                    {pool?.epochs?.map((epoch, i) => (
                      <SinglePoolPosition key={i} epoch={epoch} />
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
};

type SinglePoolPositionProps = {
  epoch: convertedEpoch;
};

export const SinglePoolPosition = ({ epoch }: SinglePoolPositionProps) => {
  return (
    <div className="min-w-0 flex-1 flex items-center gap-x-3 cursor-pointer">
      {epoch?.rate?.label}
    </div>
  );
};
