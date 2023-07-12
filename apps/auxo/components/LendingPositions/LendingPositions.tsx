import Image from 'next/image';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import {
  formatBalanceCurrency,
  formatBalance,
  formatAsPercent,
} from '../../utils/formatBalance';
import {
  useEnanchedPools,
  userMergedPosition,
} from '../../hooks/useEnanchedPools';
import { useAppSelector } from '../../hooks';
import Link from 'next/link';
import { isEmpty, isEqual } from 'lodash';
import { zeroBalance } from '../../utils/balances';
import { useCoinGeckoTokenPrice } from '../../hooks/useCoingecko';
import { useConnectWallet } from '@web3-onboard/react';

export const LendingPositions = () => {
  const { t } = useTranslation();
  const { userTotalDeposited, userTotalClaimable } = useAppSelector(
    (state) => state.lending,
  );
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const { data, isLoading, isError } = useEnanchedPools();

  if (!account || !wallet?.provider) return null;
  if (isLoading || isError || isEmpty(data)) return null;
  if (
    data.every((position) => isEqual(position?.userData?.balance, zeroBalance))
  )
    return null;

  const totalUserDepositedInUSD = formatBalanceCurrency(userTotalDeposited);
  const totalClaimableInUSD = formatBalanceCurrency(userTotalClaimable);

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
                  {t('myPositions')}
                  <span className="text-xs text-white bg-gradient-major-secondary-predominant rounded-full px-2 py-0.5">
                    {Array.isArray(data) ? data?.length : 1}
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
                <div className="flex gap-x-2 flex-col sm:flex-row justify-between border-y border-custom-border py-2">
                  <dl className="flex gap-x-1 justify-between">
                    <dt className="text-sub-dark">
                      {t('totalPositionsBalance')}
                    </dt>
                    <dd className="font-medium text-right text-primary">
                      {totalUserDepositedInUSD}
                    </dd>
                  </dl>
                  <dl className="flex gap-x-1 justify-between">
                    <dt className="text-sub-dark">{t('totalEarnings')}</dt>
                    <dd className="font-medium text-right text-primary">
                      {totalClaimableInUSD}
                    </dd>
                  </dl>
                </div>
                <div className="w-full flex flex-col">
                  <div className="min-w-0 flex-1 px-4 mt-2 md:grid sm:grid-cols-6 sm:gap-4 text-sub-dark p-2 hidden">
                    <div className="flex flex-col justify-between col-span-1">
                      <p className="text-xs">{t('pool')}</p>
                    </div>
                    <div className="flex flex-col justify-center col-span-1">
                      <p className="text-xs">{t('balance')}</p>
                    </div>
                    <div className="flex flex-col justify-center col-span-1">
                      <p className="text-xs">{t('usdValue')}</p>
                    </div>
                    <div className="flex flex-col justify-center col-span-2">
                      <p className="text-xs">{t('yield')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col mt-2 gap-y-2">
                    {Array.isArray(data) ? (
                      data?.map((position, i) => (
                        <SinglePoolPosition key={i} position={position} />
                      ))
                    ) : (
                      <SinglePoolPosition position={data} />
                    )}
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
  position: userMergedPosition;
};

export const SinglePoolPosition = ({ position }: SinglePoolPositionProps) => {
  const { t } = useTranslation();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { data: valueInUsd } = useCoinGeckoTokenPrice(
    position?.principal,
    'usd',
  );

  if (isEqual(position?.userData?.balance, zeroBalance)) return null;

  return (
    <Link passHref href={`/pools/${position?.attributes?.address}`}>
      <div className="min-w-0 flex-1 flex items-center gap-x-3 cursor-pointer">
        <div className="w-full grid md:grid-cols-6 md:gap-x-4 px-4 py-2 bg-[#F7F7FF] rounded-md items-center">
          <div className="flex w-full items-center gap-x-2 border-b md:border-0 mb-1 md:mb-0 pb-1 md:pb-0 justify-between">
            <div className="flex gap-x-2 items-center relative">
              {position?.attributes?.token?.data?.attributes?.icon?.data
                ?.attributes?.url ? (
                <div className="flex flex-shrink-0">
                  <Image
                    src={`${position?.attributes?.token?.data?.attributes?.icon?.data?.attributes?.url}`}
                    width={24}
                    height={24}
                    alt={
                      position?.attributes?.token?.data?.attributes?.icon?.data
                        ?.attributes?.name
                    }
                  />
                </div>
              ) : null}
              <span className="text-primary font-bold text-base">
                {position?.attributes?.token?.data?.attributes?.symbol}
              </span>
            </div>
            <div className="flex md:hidden">
              <p className="text-sm text-primary font-medium">
                {formatBalance(
                  position?.userData?.balance?.label,
                  defaultLocale,
                  4,
                  'standard',
                )}{' '}
                {position?.attributes?.token?.data?.attributes?.symbol}
              </p>
            </div>
          </div>
          <div className="hidden flex-col md:flex">
            <p className="text-sm text-primary font-medium">
              {formatBalance(
                position?.userData?.balance?.label,
                defaultLocale,
                4,
                'standard',
              )}{' '}
              {position?.attributes?.token?.data?.attributes?.symbol}
            </p>
          </div>
          <div className="w-full grid grid-cols-2 lg:grid-cols-1 gap-4 py-1 items-center">
            <div className="flex items-center md:hidden">
              <p className="text-sm text-sub-dark font-medium">
                {t('usdValue')}
              </p>
            </div>
            <div className="flex items-center gap-x-1 ml-auto lg:ml-0 text-primary">
              {formatBalanceCurrency(valueInUsd, 'en-US', 'USD', false, 4)}
            </div>
          </div>

          <div className="w-full grid grid-cols-2 lg:grid-cols-1 gap-4 py-1 items-center">
            <div className="flex items-center md:hidden">
              <p className="text-sm text-sub-dark font-medium">{t('yield')}</p>
            </div>
            <div className="flex items-center gap-x-1 ml-auto lg:ml-0 text-primary">
              {formatBalance(
                position?.userData?.yield?.label,
                defaultLocale,
                2,
              )}
              <span>
                {position?.attributes?.token?.data?.attributes?.symbol}
              </span>
            </div>
          </div>
          <div className="grid-cols-1 gap-4 py-1 items-center col-span-2 hidden md:grid">
            <div className="flex items-center gap-x-1 ml-auto lg:ml-0 justify-end">
              {position?.lastActiveEpoch?.rate?.label ? (
                <p className="text-sm font-medium text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5">
                  {t('poolAPR', {
                    apr: formatAsPercent(
                      position?.lastActiveEpoch?.rate?.label,
                      'en-US',
                      2,
                    ),
                  })}
                </p>
              ) : null}
              <div className="flex flex-shrink-0">
                <ChevronRightIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
