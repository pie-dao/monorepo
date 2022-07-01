import Image from 'next/image';
import { VaultTableData } from '../../hooks/useFormatDataForVaults';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setVault } from '../../store/sidebar/sidebar.slice';
import classNames from '../../utils/classnames';
import { useAppSelector } from '../../hooks';

export default function VaultTable({ vault }: { vault: VaultTableData }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hideBalance } = useAppSelector((state) => state.preferences);
  return (
    <Disclosure
      key={vault.name.main}
      as="div"
      className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden"
      data-cy={`vault-table-${vault.name.main}`}
    >
      {({ open }) => (
        <>
          <Disclosure.Button as="div" className="cursor-pointer">
            <div className="flex items-center">
              <div className="min-w-0 flex-1 flex items-start">
                <div className="flex-shrink-0 self-start">
                  <Image
                    src={vault.image}
                    alt={vault.name.main}
                    height={40}
                    width={40}
                  />
                </div>
                <div className="min-w-0 flex-1 px-4 grid grid-cols-2 sm:grid-cols-4 sm:gap-4 items-center">
                  <div className="flex flex-col justify-between">
                    <p className="text-base font-bold truncate">
                      {vault.name.main}
                    </p>
                    <p className="text-xs text-sub-dark hidden sm:block truncate">
                      {vault.name.sub}
                    </p>
                    <p
                      className={classNames(
                        'text-base text-sub-dark block sm:hidden truncate',
                        hideBalance && 'hidden-balance-sub-dark',
                      )}
                    >
                      {vault.balance} {vault.name.sub}
                    </p>
                  </div>
                  <div className="flex-row items-center gap-x-2 hidden sm:flex flex-wrap">
                    <p
                      className="text-xs xl:text-base border rounded-full border-secondary text-center px-2 py-1 font-medium"
                      data-cy="APY"
                    >
                      APY {vault.APY}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center text-right hidden sm:block">
                    <p
                      className={classNames(
                        `text-base text-primary`,
                        hideBalance && `hidden-balance-primary`,
                      )}
                      data-cy="balance"
                    >
                      {vault.balance}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center text-right">
                    <p
                      className={classNames(
                        'text-base text-primary font-medium',
                        hideBalance && 'hidden-balance-primary',
                      )}
                      data-cy="value"
                    >
                      {vault.value}
                    </p>
                    <p className="text-base text-secondary block sm:hidden">
                      APY {vault.APY}
                    </p>
                  </div>
                </div>
              </div>
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
                key={'panel-' + vault.name.main}
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{
                  duration: 0.2,
                }}
                className="bg-background rounded-lg overflow-hidden"
              >
                <motion.div
                  variants={{
                    collapsed: { scale: 0.8 },
                    open: { scale: 1 },
                  }}
                  transition={{ duration: 0.3 }}
                  className="origin-top-center py-4 space-y-1"
                >
                  <div className="min-w-0 flex-1 flex items-start">
                    <div className="grid grid-cols-2 sm:flex min-w-0 flex-1 px-4 gap-2 sm:gap-4 items-center sm:text-center justify-between">
                      <div className="flex flex-col justify-between text-left">
                        <h3 className="text-xs text-sub-dark">
                          {t('dashboard:myDeposits')}
                        </h3>
                        <p
                          className={classNames(
                            'text-xs text-primary',
                            hideBalance && 'hidden-balance-primary',
                          )}
                        >
                          {vault.subRow.userDeposited}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between text-right sm:text-center">
                        <h3 className="text-xs text-sub-dark">
                          {t('dashboard:24hDeposits')}
                        </h3>
                        <p className="text-xs text-primary">
                          {vault.subRow.userEarningsTwentyFourHours}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between">
                        <h3 className="text-xs text-sub-dark">
                          {t('dashboard:userEarnings')}
                        </h3>
                        <p
                          className={classNames(
                            'text-xs text-primary',
                            hideBalance && 'hidden-balance-primary',
                          )}
                        >
                          {vault.subRow.userEarnings}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between text-right">
                        <h3 className="text-xs text-sub-dark">
                          {t('dashboard:totalDeposits')}
                        </h3>
                        <p className="text-xs text-primary">
                          {vault.subRow.totalDesposited}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
          <div className="min-w-0 flex-1 flex gap-4 flex-col sm:flex-row">
            <div className="flex flex-1 items-center gap-x-4">
              <div className="flex flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-secondary h-1.5 rounded-full"
                  style={{ width: vault.portfolioPercentage }}
                ></div>
              </div>
              <div className="text-sm" data-cy="percentage">
                {vault.portfolioPercentage}
              </div>
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, width: 0 },
                    visible: { opacity: 1, width: 'auto' },
                  }}
                  transition={{ duration: 0.2 }}
                  className="gap-x-2 flex"
                >
                  <Link
                    href={`/vaults/${encodeURIComponent(vault.name.main)}`}
                    passHref
                  >
                    <button className="w-full sm:w-auto px-8 py-1 text-base font-medium text-text bg-transparent rounded-2xl border border-text hover:bg-text hover:text-white">
                      {t('dashboard:discover')}
                    </button>
                  </Link>
                  <button
                    className="w-full sm:w-auto px-8 py-1 text-base font-medium text-text bg-transparent rounded-2xl border border-text hover:bg-text hover:text-white"
                    onClick={() => dispatch(setVault(vault.name.main))}
                  >
                    {t('dashboard:trade')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </Disclosure>
  );
}
