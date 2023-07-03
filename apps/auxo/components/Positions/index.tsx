import { Disclosure, Tab } from '@headlessui/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import {
  formatAsPercentOfTotal,
  formatBalance,
  formatBalanceCurrency,
} from '../../utils/formatBalance';
import { getChainImageUrl } from '../../utils/images';
import { isEmpty } from 'lodash';
import { useStrapiCollection } from '../../hooks';
import { TypesMap } from '../../types/cmsTypes';
import { useMemo } from 'react';

const variants: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export default function PositionsTabs() {
  const { t } = useTranslation();

  const { data: exposures, isLoading } = useStrapiCollection<
    TypesMap['exposures']
  >('exposures', {
    populate: 'deep,4',
  });

  const strategiesList = useMemo(() => {
    if (isLoading || isEmpty(exposures)) {
      return [];
    }

    const flatList = exposures?.data?.flatMap((exposure) =>
      exposure?.attributes?.positions_farmings?.data?.flatMap(
        (position) => position.attributes?.strategies?.data,
      ),
    );

    const uniqueList = flatList?.filter(
      (strategy, index, self) =>
        index === self.findIndex((s) => s.id === strategy.id),
    );

    return uniqueList;
  }, [exposures, isLoading]);

  return (
    <section className="w-full pb-16 mt-8">
      <Tab.Group>
        <Tab.List className="md:flex p-1 md:max-w-xs gap-x-2 grid grid-cols-2 w-full mb-4">
          {['Treasury positions', 'Strategy details'].map((title) => (
            <Tab
              className={({ selected }) =>
                classNames(
                  'md:w-fit py-2 text-md font-medium leading-5 focus:outline-none relative text-center',
                  !selected && 'text-sub-light',
                  selected && 'text-secondary',
                )
              }
              key={title}
              data-cy={`product-tab-${title.toLowerCase()}`}
            >
              {({ selected }) => (
                <>
                  {t(title)}
                  {selected ? (
                    <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary" />
                  ) : null}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          <SingleProductPanel className="divide-y">
            <div className="w-full flex flex-col space-between">
              <div className="hidden items-center mb-2 lg:flex">
                <div className="min-w-0 flex-1 flex items-start px-3">
                  <div className="flex-shrink-0 w-[40px]"></div>
                  <div className="min-w-0 flex-1 px-4 sm:px-0 sm:grid sm:grid-cols-7 sm:gap-4 ">
                    <div className="flex flex-col justify-between col-span-1 -ml-[55px] md:ml-0">
                      <p className="text-xs">{t('position')}</p>
                    </div>
                    <div className="flex flex-col justify-center col-span-4">
                      <p className="text-xs">{t('holding')}</p>
                    </div>
                  </div>
                </div>
                <div className="h-5 w-5"></div>
              </div>
              <div className="flex flex-col gap-y-2">
                {!isEmpty(exposures)
                  ? exposures?.data?.map((item) => (
                      <SingleTokenPosition key={`${item.id}`} exposure={item} />
                    ))
                  : null}
              </div>
            </div>
          </SingleProductPanel>
          <SingleProductPanel
            className="divide-y gap-x-2"
            testId="product-tab-description-content"
          >
            <div className="bg-gradient-primary shadow-md rounded-lg px-3 py-4 flex flex-col gap-y-4 overflow-hidden">
              {!isEmpty(strategiesList)
                ? strategiesList.map((item, index) => (
                    <Disclosure
                      key={index}
                      as="div"
                      className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden"
                      data-cy="strategy-item"
                    >
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            as="div"
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-x-2">
                              <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: open ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex"
                              >
                                <ChevronDownIcon
                                  className="h-5 w-5 text-sub-dark"
                                  aria-hidden="true"
                                />
                              </motion.div>
                              <div className="flex-1">
                                <h3 className="text-sm text-primary font-medium leading-5">
                                  {item?.attributes?.Title}
                                </h3>
                              </div>
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
                                key={'panel-' + index}
                                variants={{
                                  open: { opacity: 1, height: 'auto' },
                                  collapsed: { opacity: 0, height: 0 },
                                }}
                                transition={{
                                  duration: 0.2,
                                }}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  variants={{
                                    collapsed: { opacity: 0, y: -20 },
                                    open: { opacity: 1, y: 0 },
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="py-2 space-y-1 border-t border-customBorder mt-2"
                                >
                                  <p className="text-primary text-base">
                                    {item?.attributes?.Description}
                                  </p>
                                </motion.div>
                              </Disclosure.Panel>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </Disclosure>
                  ))
                : t('noStrategies')}
            </div>
          </SingleProductPanel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  );
}

export function SingleProductPanel({
  className,
  children,
  testId,
}: {
  className?: string;
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <Tab.Panel>
      <motion.div
        layout
        variants={variants}
        initial="initial"
        exit="exit"
        animate="animate"
        className={classNames('max-w-none', className)}
        data-cy={testId}
      >
        {children}
      </motion.div>
    </Tab.Panel>
  );
}

export type SingleTokenPositionProps = {
  exposure: TypesMap['exposure'];
};

export const SingleTokenPosition = ({ exposure }: SingleTokenPositionProps) => {
  const { t } = useTranslation();
  const positionsFarming = exposure?.attributes?.positions_farmings?.data;
  const principalAmount = positionsFarming
    ?.map((position) => position?.attributes?.principal_amount)
    ?.reduce((a, b) => a + b, 0);

  return (
    <Disclosure
      as="div"
      className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden"
      defaultOpen
    >
      {({ open }) => (
        <>
          <Disclosure.Button as="div" className="cursor-pointer">
            <div className="flex items-center mb-2">
              <div className="min-w-0 flex-1 flex items-center">
                <div className="flex flex-shrink-0 self-start">
                  {exposure?.attributes?.Icon?.data?.attributes?.url ? (
                    <div className="flex flex-shrink-0 self-start">
                      <Image
                        src={`${exposure?.attributes?.Icon?.data?.attributes?.url}`}
                        alt={exposure?.attributes?.Title}
                        height={36}
                        width={36}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 px-2 flex sm:gap-4 items-center justify-between lg:justify-start lg:grid lg:grid-cols-7">
                  <div className="flex flex-col justify-between col-span-1">
                    <p
                      className="text-base font-bold text-primary"
                      data-cy="name"
                    >
                      {exposure?.attributes?.Title}
                    </p>
                  </div>
                  <div className="flex-col justify-center hidden lg:block col-span-4">
                    {exposure.id !== 7 && (
                      <p
                        className="text-base text-primary"
                        data-cy="principalAmount"
                      >
                        {formatBalanceCurrency(
                          principalAmount,
                          'en-US',
                          'USD',
                          false,
                          2,
                        )}
                      </p>
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col justify-center text-right col-span-2">
                    {exposure.id !== 7 && (
                      <p className="text-base text-primary font-medium">
                        {formatBalanceCurrency(
                          principalAmount,
                          'en-US',
                          'USD',
                          true,
                        )}
                      </p>
                    )}
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
                  className="h-7 w-7 text-primary"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
            {exposure?.id !== 7 && (
              <div className="flex lg:hidden items-center justify-between py-2 border-t border-custom-border">
                <p className="text-primary font-bold">{t('holding')}:</p>
                <p className="text-primary font-bold">
                  {formatBalance(principalAmount)}
                  <span className="text-sm text-sub-light">
                    {' '}
                    (
                    {formatBalanceCurrency(
                      principalAmount,
                      'en-US',
                      'USD',
                      true,
                    )}
                    )
                  </span>
                </p>
              </div>
            )}
          </Disclosure.Button>
          <AnimatePresence initial={false}>
            {open && (
              <Disclosure.Panel
                as={motion.div}
                initial="collapsed"
                animate="open"
                static
                exit="collapsed"
                key={'panel-' + exposure?.attributes?.Title}
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{
                  duration: 0.2,
                }}
                className="rounded-lg overflow-hidden"
              >
                <motion.div
                  variants={{
                    collapsed: { scale: 0.8 },
                    open: { scale: 1 },
                  }}
                  transition={{ duration: 0.3 }}
                  className="origin-top space-y-1 border-t"
                >
                  <div className="w-full flex flex-col space-between ">
                    <div className="hidden items-center sm:flex mt-4">
                      <div className="min-w-0 flex-1 flex items-start">
                        {exposure.id !== 7 && (
                          <div className="flex-shrink-0 w-[50px]"></div>
                        )}
                        <div className="min-w-0 flex-1 hidden lg:grid lg:grid-cols-5 sm:gap-4 px-4 text-sub-dark">
                          <div>
                            <p className="text-xs">{t('amount')}</p>
                          </div>
                          <div>
                            <p className="text-xs">{t('protocol')}</p>
                          </div>
                          <div>
                            <p className="text-xs">{t('strategy')}</p>
                          </div>
                          <div>
                            <p className="text-xs">{t('rewards')}</p>
                          </div>
                          {exposure.id !== 7 && (
                            <div className="text-right">
                              <p className="text-xs">{t('value')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-2 mt-2">
                      {positionsFarming?.map((position) => (
                        <div
                          className="min-w-0 flex-1 flex items-center gap-x-3"
                          key={position.id}
                        >
                          {exposure.id !== 7 && (
                            <div className="flex-shrink-0 w-[40px] hidden lg:flex">
                              <p className="text-xs text-secondary">
                                {formatAsPercentOfTotal(
                                  position?.attributes?.principal_amount,
                                  principalAmount,
                                )}
                              </p>
                            </div>
                          )}
                          <div className="w-full grid lg:grid-cols-5 lg:gap-x-4 px-4 py-2 bg-[#F7F7FF] rounded-md items-center">
                            <div className="flex-row hidden lg:block">
                              <p className="text-xs text-primary">
                                {formatBalance(
                                  position?.attributes?.principal_amount,
                                  'en-US',
                                  2,
                                  'compact',
                                )}{' '}
                                {
                                  position?.attributes?.principal?.data
                                    ?.attributes?.symbol
                                }
                              </p>
                            </div>
                            <div className="flex w-full items-center gap-x-2 border-b lg:border-0 mb-1 lg:mb-0 pb-1 lg:pb-0">
                              {exposure?.id !== 7 && (
                                <div className="flex lg:hidden">
                                  <p className="flex text-md text-secondary">
                                    {formatAsPercentOfTotal(
                                      position?.attributes?.principal_amount,
                                      principalAmount,
                                    )}
                                  </p>
                                </div>
                              )}
                              <div className="flex gap-x-4 items-center relative">
                                {position?.attributes?.protocol?.data
                                  ?.attributes?.icon?.data?.[0]?.attributes
                                  ?.url ? (
                                  <div className="flex flex-shrink-0">
                                    <Image
                                      src={`${position?.attributes?.protocol?.data?.attributes?.icon?.data?.[0]?.attributes?.url}`}
                                      width={24}
                                      height={24}
                                      alt={
                                        position?.attributes?.protocol?.data
                                          ?.attributes?.icon?.data?.[0]
                                          ?.attributes?.name
                                      }
                                    />
                                  </div>
                                ) : null}
                                <div className="absolute top-0 left-4 transform -translate-y-1/2 w-3.5 h-3.5">
                                  <Image
                                    src={getChainImageUrl(
                                      position?.attributes?.Network?.toLowerCase(),
                                    )}
                                    width={20}
                                    height={20}
                                    alt={position?.attributes?.Network}
                                  />
                                </div>
                                <div>
                                  <p className="text-md lg:text-sm text-primary ml-auto truncate max-w-[7rem] sm:max-w-none">
                                    {
                                      position?.attributes?.protocol?.data
                                        ?.attributes?.name
                                    }
                                  </p>
                                </div>
                              </div>
                              <div className="flex-col flex lg:hidden ml-auto">
                                <p className="text-sm text-primary">
                                  {formatBalance(
                                    position?.attributes?.principal_amount,
                                    'en-US',
                                    2,
                                    'compact',
                                  )}{' '}
                                  {
                                    position?.attributes?.principal?.data
                                      ?.attributes?.symbol
                                  }
                                </p>
                              </div>
                            </div>
                            <MobileAccordionContent
                              title={'value'}
                              content={formatBalanceCurrency(
                                position?.attributes?.principal_amount,
                                'en-US',
                                'USD',
                                true,
                              )}
                            />
                            <MobileAccordionContent
                              title={'strategy'}
                              content={position?.attributes?.strategies?.data
                                ?.map((strategy) => strategy?.attributes?.Title)
                                .join(', ')}
                            />
                            <div className="hidden flex-col lg:flex">
                              <p className="text-xs text-primary">
                                {position?.attributes?.strategies?.data
                                  ?.map(
                                    (strategy) => strategy?.attributes?.Title,
                                  )
                                  .join(', ')}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 py-1 items-center">
                              <p className="text-sm text-sub-dark flex lg:hidden">
                                {t('rewards')}
                              </p>
                              <div className="flex items-center gap-x-1 ml-auto lg:ml-0">
                                {position?.attributes?.rewards?.data?.map(
                                  (reward) =>
                                    reward?.attributes?.icon?.data?.attributes
                                      ?.url && (
                                      <Image
                                        key={reward?.id}
                                        src={`${reward?.attributes?.icon?.data?.attributes?.url}`}
                                        width={24}
                                        height={24}
                                        alt={
                                          reward?.attributes?.icon?.data
                                            ?.attributes?.name
                                        }
                                      />
                                    ),
                                )}
                              </div>
                            </div>
                            {exposure.id !== 7 && (
                              <div className="hidden flex-col lg:flex text-right">
                                <p className="text-xs text-primary">
                                  {formatBalance(
                                    position?.attributes?.principal_amount,
                                    'en-US',
                                    2,
                                    'compact',
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
          {/* <div className="min-w-0 flex-1 flex gap-4 flex-col sm:flex-row">
            <div className="flex flex-1 items-center gap-x-4">
              <div className="flex flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-secondary h-1.5 rounded-full"
                  style={{ width: `${token.totalPrincipalRelative}%` }}
                ></div>
              </div>
              <div className="text-sm" data-cy="percentage">
                {formatAsPercent(token.totalPrincipalRelative)}
              </div>
            </div>
          </div> */}
        </>
      )}
    </Disclosure>
  );
};

export const MobileAccordionContent = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-4 py-1 lg:hidden">
      <dt className="text-sm text-sub-dark">{t(title)}</dt>
      <dd className="text-sm font-medium text-primary mt-0 text-right truncate">
        {content}
      </dd>
    </div>
  );
};
