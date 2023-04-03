import { Disclosure, Tab } from '@headlessui/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import {
  formatAsPercent,
  formatBalance,
  formatBalanceCurrency,
} from '../../utils/formatBalance';
import PriceChange from '../PriceChange/PriceChange';
import { getChainImageUrl } from '../../utils/images';
import { isEmpty } from 'lodash';

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

export default function PositionsTabs(treasuryPositions) {
  const { t } = useTranslation();

  const strategies = [
    {
      title: 'Beethoven LP Strategy - USDC/fUSDT/MIM liquidity pool',
      description:
        'Supplies liquidity to Beethovenx in the Ziggy Stardust & Magic Internet Money pool. LP position earns trading fees and BEETS. This strategy tries to maximise yield by providing part of earned BEETS in the Fidelio Duetto 80/20 pool and staking Fidelio Duetto BPTs to earn more BEETS. Earned rewards are sold and reinvested.',
      allocationPercentage: 30,
      links: [
        {
          title: 'Link 1',
          url: 'https://www.google.com',
        },
        {
          title: 'Link 2',
          url: 'https://www.google.com',
        },
      ],
    },
    {
      title: 'Beethoven LP Strategy - USDC/fUSDT/MIM liquidity pool',
      description:
        'Supplies liquidity to Beethovenx in the Ziggy Stardust & Magic Internet Money pool. LP position earns trading fees and BEETS. This strategy tries to maximise yield by providing part of earned BEETS in the Fidelio Duetto 80/20 pool and staking Fidelio Duetto BPTs to earn more BEETS. Earned rewards are sold and reinvested.',
      allocationPercentage: 70,
      links: [
        {
          title: 'Link 1',
          url: 'https://www.google.com',
        },
        {
          title: 'Link 2',
          url: 'https://www.google.com',
        },
      ],
    },
  ];
  return (
    <section className="w-full px-4 md:px-10 pb-16 bg-background">
      <Tab.Group>
        <Tab.List className="md:flex p-1 md:max-w-xs gap-x-2 grid grid-cols-2 w-full mb-4">
          {['Treasury positions', 'Strategy details'].map((title) => (
            <Tab
              className={({ selected }) =>
                classNames(
                  'md:w-fit py-1 text-md font-medium leading-5 focus:outline-none relative text-center',
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
                    <motion.div
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary"
                      layoutId="underlineListPosition"
                    />
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
                  <div className="min-w-0 flex-1 px-4 sm:px-0 sm:grid sm:grid-cols-8 sm:gap-4 ">
                    <div className="flex flex-col justify-between col-span-1 -ml-[55px] md:ml-0">
                      <p className="text-xs">{t('token')}</p>
                    </div>
                    <div className="flex flex-col justify-between col-span-1">
                      <p className="text-xs">{t('price')}</p>
                    </div>
                    <div className="flex flex-col justify-center col-span-4">
                      <p className="text-xs">{t('holding')}</p>
                    </div>
                  </div>
                </div>
                <div className="h-5 w-5"></div>
              </div>
              <div className="flex flex-col gap-y-2">
                <SingleTokenPosition />
                <SingleTokenPosition />
                <SingleTokenPosition />
              </div>
            </div>
          </SingleProductPanel>
          <SingleProductPanel
            className="divide-y gap-x-2"
            testId="product-tab-description-content"
          >
            <div className="bg-gradient-primary shadow-md rounded-lg px-3 py-4 flex flex-col gap-y-4 overflow-hidden">
              {!isEmpty(strategies)
                ? strategies.map((item, index) => (
                    <Disclosure
                      key={`${item.title}-${index}`}
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
                                  {item.title}
                                </h3>
                              </div>
                              <div>
                                <p className="text-secondary text-sm">
                                  {formatAsPercent(item.allocationPercentage)}
                                </p>
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
                                  <p>{item.description}</p>
                                  <div className="flex flex-wrap gap-4 mt-4">
                                    {item.links.map((link, index) => (
                                      <a
                                        key={`${link.title}-${index}`}
                                        href={link.url}
                                        className="text-secondary text-sm"
                                      >
                                        {link.title}
                                      </a>
                                    ))}
                                  </div>
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

export const SingleTokenPosition = () => {
  const { t } = useTranslation();
  const token = {
    icon: 'http://188.166.45.35:8080/uploads/eth_90d032940f.png',
    name: 'Ethereum',
    symbol: 'ETH',
    priceIn24h: {
      value: 2.3,
      change: 3.1,
    },
    totalPrincipalAmount: 30020120,
    totalPrincipalRelative: 30,
    totalValue: 2313001.2,
    positions: [
      {
        id: 8,
        principalRelative: 10,
        network: 'ethereum',
        principalAmount: 20200,
        principalValue: 2335739.23,
        protocol: {
          title: 'Compound',
          icon:
            process.env.NEXT_PUBLIC_CMS_ENDPOINT +
            '/uploads/eth_90d032940f.png',
        },
        strategies: [
          {
            title: 'GLP',
            description: 'Provide liquidity into GLP',
          },
          {
            title: 'Sen tran + gauge',
            description: 'Provide liquidity into GLP',
          },
        ],
        APR: 23.2,
        rewards: [
          {
            name: 'Sushi',
            icon:
              process.env.NEXT_PUBLIC_CMS_ENDPOINT +
              '/uploads/eth_90d032940f.png',
          },
          {
            name: 'L2 Optimism',
            icon:
              process.env.NEXT_PUBLIC_CMS_ENDPOINT +
              '/uploads/eth_90d032940f.png',
          },
        ],
        valueInUSD: 20200,
      },
      {
        id: 1,
        principalRelative: 90,
        network: 'polygon',
        principalAmount: 20200,
        principalValue: 2335739.23,
        protocol: {
          title: 'Curve',
          icon:
            process.env.NEXT_PUBLIC_CMS_ENDPOINT +
            '/uploads/eth_90d032940f.png',
        },
        strategies: [
          {
            title: 'GLP',
            description: 'Provide liquidity into GLP',
          },
        ],
        APR: 23.2,
        rewards: [
          {
            name: 'Sushi',
            icon:
              process.env.NEXT_PUBLIC_CMS_ENDPOINT +
              '/uploads/eth_90d032940f.png',
          },
          {
            name: 'L2 Optimism',
            icon:
              process.env.NEXT_PUBLIC_CMS_ENDPOINT +
              '/uploads/eth_90d032940f.png',
          },
        ],
        valueInUSD: 20200,
      },
    ],
  };
  return (
    <Disclosure
      key={token.name}
      as="div"
      className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden"
      data-cy={`positions-table-${token.name}`}
    >
      {({ open }) => (
        <>
          <Disclosure.Button as="div" className="cursor-pointer">
            <div className="flex items-center mb-2">
              <div className="min-w-0 flex-1 flex items-center">
                <div className="flex flex-shrink-0 self-start">
                  <Image
                    src={token.icon}
                    alt={token.name}
                    height={36}
                    width={36}
                  />
                </div>
                <div className="min-w-0 flex-1 px-2 flex sm:gap-4 items-center justify-between lg:justify-start lg:grid lg:grid-cols-8">
                  <div className="flex flex-col justify-between col-span-1">
                    <p
                      className="text-base font-bold text-primary"
                      data-cy="name"
                    >
                      {token.symbol}
                    </p>
                    <p className="text-xs text-sub-dark hidden lg:block">
                      {token.name}
                    </p>
                  </div>
                  <div className="flex flex-row lg:flex-col justify-between col-span-1 items-center lg:items-start gap-x-2">
                    <p className="text-base" data-cy="price">
                      {formatBalanceCurrency(
                        token.priceIn24h.value,
                        'en-US',
                        'USD',
                        false,
                      )}
                    </p>
                    <p className="text-xs text-secondary">
                      <PriceChange amount={token.priceIn24h.change} />
                    </p>
                  </div>
                  <div className="flex-col justify-center hidden lg:block col-span-4">
                    <p
                      className="text-base text-primary"
                      data-cy="principalAmount"
                    >
                      {formatBalance(
                        token.totalPrincipalAmount,
                        'en-US',
                        2,
                        'compact',
                      )}
                    </p>
                  </div>
                  <div className="hidden lg:flex flex-col justify-center text-right col-span-2">
                    <p
                      className="text-base text-primary font-medium"
                      data-cy="value"
                    >
                      {formatBalanceCurrency(
                        token.totalValue,
                        'en-US',
                        'USD',
                        true,
                      )}
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
                  className="h-7 w-7 text-primary"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
            <div className="flex lg:hidden items-center justify-between py-2 border-t border-custom-border">
              <p>{t('holding')}:</p>
              <p>
                {formatBalance(token.totalPrincipalAmount)}
                <span className="text-sm text-sub-light">
                  {' '}
                  (
                  {formatBalanceCurrency(
                    token.totalValue,
                    'en-US',
                    'USD',
                    true,
                  )}
                  )
                </span>
              </p>
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
                key={'panel-' + token.name}
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
                        <div className="flex-shrink-0 w-[40px]"></div>
                        <div className="min-w-0 flex-1 hidden lg:grid lg:grid-cols-7 sm:gap-4 px-4 text-sub-dark">
                          <div>
                            <p className="text-xs">{t('amount')}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs">{t('protocol')}</p>
                          </div>
                          <div>
                            <p className="text-xs">{t('strategy')}</p>
                          </div>
                          <div>
                            <p className="text-xs">{t('apr')}</p>
                          </div>
                          <div>
                            <p className="text-xs">{t('rewards')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs">{t('value')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-2 mt-2">
                      {token.positions.map((position) => (
                        <div
                          className="min-w-0 flex-1 flex items-center"
                          key={position.id}
                        >
                          <div className="flex-shrink-0 w-[40px] hidden lg:flex">
                            <p className="text-xs text-secondary">
                              {formatAsPercent(position.principalRelative)}
                            </p>
                          </div>
                          <div className="w-full grid lg:grid-cols-7 lg:gap-x-4 px-4 py-2 bg-[#F7F7FF] rounded-md items-center">
                            <div className="flex-row hidden lg:block">
                              <p className="text-xs text-primary">
                                {formatBalance(
                                  position.principalAmount,
                                  'en-US',
                                  2,
                                  'compact',
                                )}{' '}
                                {token.symbol}
                              </p>
                            </div>
                            <div className="flex w-full items-center gap-x-2 border-b lg:border-0 mb-1 lg:mb-0 pb-1 lg:pb-0 lg:col-span-2">
                              <div className="flex lg:hidden">
                                <p className="flex text-md text-secondary">
                                  {formatAsPercent(position.principalRelative)}
                                </p>
                              </div>
                              <div className="flex gap-x-2 items-center relative">
                                <div className="flex flex-shrink-0">
                                  <Image
                                    src={position.protocol.icon}
                                    width={24}
                                    height={24}
                                    alt={position.protocol.title}
                                  />
                                </div>
                                <div className="absolute top-0 left-4 transform -translate-y-1/2 w-3.5 h-3.5">
                                  <Image
                                    src={getChainImageUrl(
                                      position.network.toLowerCase(),
                                    )}
                                    width={20}
                                    height={20}
                                    alt={position.network}
                                  />
                                </div>
                                <div>
                                  <p className="text-md lg:text-sm text-primary ml-auto">
                                    {position.protocol.title}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-col flex lg:hidden ml-auto">
                                <p className="text-sm text-primary">
                                  {formatBalance(
                                    position.principalAmount,
                                    'en-US',
                                    2,
                                    'compact',
                                  )}{' '}
                                  {token.symbol}
                                </p>
                              </div>
                            </div>
                            <MobileAccordionContent
                              title={'value'}
                              content={formatBalanceCurrency(
                                position.principalValue,
                                'en-US',
                                'USD',
                                true,
                              )}
                            />
                            <MobileAccordionContent
                              title={'strategy'}
                              content={position.strategies
                                .map((strategy) => strategy.title)
                                .join(', ')}
                            />
                            <MobileAccordionContent
                              title={'apr'}
                              content={formatAsPercent(position.APR)}
                            />
                            <div className="hidden flex-col lg:flex">
                              <p className="text-xs text-primary">
                                {position.strategies
                                  .map((strategy) => strategy.title)
                                  .join(', ')}
                              </p>
                            </div>
                            <div className="hidden flex-col lg:flex">
                              <p className={classNames(`text-xs text-primary`)}>
                                {formatAsPercent(position.APR)}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 py-1 items-center">
                              <p className="text-sm text-sub-dark flex lg:hidden">
                                {t('rewards')}
                              </p>
                              <div className="flex items-center gap-x-1 ml-auto lg:ml-0">
                                {position.rewards.map((reward) => (
                                  <Image
                                    key={reward.name}
                                    src={reward.icon}
                                    width={24}
                                    height={24}
                                    alt={reward.name}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="hidden flex-col lg:flex text-right">
                              <p className="text-xs text-primary">
                                {formatBalanceCurrency(position.valueInUSD)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
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
                  style={{ width: `${token.totalPrincipalRelative}%` }}
                ></div>
              </div>
              <div className="text-sm" data-cy="percentage">
                {formatAsPercent(token.totalPrincipalRelative)}
              </div>
            </div>
          </div>
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
