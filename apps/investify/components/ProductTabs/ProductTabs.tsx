import { useMemo } from 'react';
import { Tab } from '@headlessui/react';
import {
  motion,
  Variants,
  AnimateSharedLayout,
  AnimatePresence,
} from 'framer-motion';
import { MDXRemote } from 'next-mdx-remote';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { DocumentTextIcon } from '@heroicons/react/solid';
import classNames from '../../utils/classnames';
import { isEmpty } from 'lodash';
import { chainMap } from '../../utils/networks';

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

interface tabsData {
  marketCap: string;
  holders: number;
  ath: string;
  atl: string;
  inceptionDate: string;
  swapFee: string;
  totalSupply: string;
  managementFee: string;
  governance: {
    title: string;
    url: string;
    status: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timestamp: any;
  }[];
  prospectus?: string;
  coingeckoId: string;
  investmentFocusImage?: string;
  address: string;
}

interface ProductTabs {
  tabsData: tabsData;
  source: {
    compiledSourceDescription: string;
    compiledSourceThesis: string;
    compiledSourceInvestmentFocus: string;
  };
}

export function ProductTabs({ tabsData, source }: ProductTabs) {
  const {
    governance,
    marketCap,
    holders,
    ath,
    atl,
    inceptionDate,
    swapFee,
    managementFee,
    totalSupply,
    prospectus,
    coingeckoId,
    investmentFocusImage,
    address,
  } = tabsData;
  const { t } = useTranslation();

  const url = useMemo(() => {
    const blockExplorer = `${chainMap[1].blockExplorerUrls[0]}/address/`;
    return blockExplorer + address;
  }, [address]);

  const keyFacts = useMemo(
    () => [
      {
        title: 'allTimeHigh',
        description: 'allTimeHighDescription',
        value: ath,
      },
      {
        title: 'allTimeLow',
        description: 'allTimeLowDescription',
        value: atl,
      },
      {
        title: 'inceptionDate',
        description: 'inceptionDateDescription',
        value: inceptionDate,
      },
      {
        title: 'swapFee',
        description: 'swapFeeDescription',
        value: swapFee,
      },
      {
        title: 'managementFee',
        description: 'managementFeeDescription',
        value: managementFee,
      },
      {
        title: 'totalSupply',
        description: 'totalSupplyDescription',
        value: totalSupply,
      },
    ],
    [ath, atl, inceptionDate, managementFee, swapFee, totalSupply],
  );

  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl p-1 max-w-xs">
          {['Description', 'Thesis', 'Details', 'Governance'].map((title) => (
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5',
                  'focus:outline-none relative',
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
                      layoutId="underline"
                    />
                  ) : null}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <SingleProductPanel
            className="divide-y"
            testId="product-tab-description-content"
          >
            <div className="prose max-w-none prose-headings:text-primary prose-p:text-primary prose-strong:text-primary prose-ul:text-primary prose-li:text-primary">
              <MDXRemote compiledSource={source.compiledSourceDescription} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-4 pt-6 pb-3 items-center mt-6">
              <a
                className="relative w-36 h-8 inline-flex"
                href={`https://coinmarketcap.com/currencies/${coingeckoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/coinMarketCap.png"
                  alt={'Coinmarketcap'}
                  layout="fill"
                  objectFit="contain"
                />
              </a>
              <a
                className="relative w-36 h-8 inline-flex"
                href={`https://www.coingecko.com/en/coins/${coingeckoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="https://raw.githubusercontent.com/pie-dao/brand/f66a0f41cc186013fd9dab2a5f618da9c8f10a74/misc/coingecko.svg"
                  alt={'PieDao Logo'}
                  layout="fill"
                  objectFit="contain"
                />
              </a>
            </div>
          </SingleProductPanel>
          <SingleProductPanel
            className="divide-y"
            testId="product-tab-thesis-content"
          >
            <div className="prose max-w-none prose-headings:text-primary prose-p:text-primary prose-strong:text-primary prose-ul:text-primary prose-li:text-primary">
              <MDXRemote compiledSource={source.compiledSourceThesis} />
            </div>
            {prospectus && (
              <div className="flex flex-wrap gap-x-2 gap-y-4 pt-6 pb-3 items-center mt-6">
                <a
                  href={prospectus}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cy="product-tab-thesis-prospectus"
                >
                  <div className="w-full sm:w-auto px-8 py-1 text-base font-medium text-text bg-transparent rounded-2xl border border-text hover:bg-text hover:text-white cursor-pointer">
                    {t('downloadProspectus')}
                  </div>
                </a>
              </div>
            )}
          </SingleProductPanel>
          <SingleProductPanel
            className="divide-y"
            testId="product-tab-details-content"
          >
            <div className="flex flex-col divide-y space-y-4 divide-custom-border">
              <div className="flex flex-col sm:flex-row gap-2 text-primary">
                <h4 className="flex gap-x-2">
                  <span className="font-bold">{t('marketCap')}</span>
                  <span data-cy="key-marketCap">
                    {marketCap ? marketCap : 'N/A'}
                  </span>
                </h4>
                <h4 className="flex gap-x-2">
                  <span className="font-bold">{t('holders')}</span>
                  <span data-cy="key-holders">{holders ? holders : 'N/A'}</span>
                </h4>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-primary my-4">{t('keyFacts')}</h3>
                <ul
                  className="grid auto-rows-max 
                     grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 text-sm"
                >
                  {keyFacts.map((item, key) => (
                    <KeyFact {...item} key={key} />
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 py-4">
                <div className="prose max-w-none prose-headings:text-primary prose-p:text-primary prose-strong:text-primary prose-ul:text-primary prose-li:text-primary">
                  <MDXRemote
                    compiledSource={source.compiledSourceInvestmentFocus}
                  />
                </div>
                <div className="flex-shrink-0 relative w-[207px] h-[189px]">
                  <Image
                    src={investmentFocusImage}
                    alt={'PieDao Investment Focus'}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <a
                  className="flex flex-col text-xs"
                  href="https://github.com/pie-dao/audits"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p>{t('audit')}</p>
                  <div className="relative w-36 h-8 inline-flex">
                    <Image
                      src="https://static.tildacdn.com/tild3234-6331-4632-b931-346235343766/Logo-mixBytes3.svg"
                      alt={'PieDao Logo'}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </a>
                <a href={url} data-cy="product-tab-details-contract">
                  <div className="group flex items-center px-4 py-2 text-sm font-medium rounded-full border border-customBorder hover:bg-white hover:drop-shadow-sm cursor-pointer text-primary">
                    <div className="h-5 w-5 cursor-pointer mr-2">
                      <DocumentTextIcon />
                    </div>
                    {t('contract')}
                  </div>
                </a>
              </div>
            </div>
          </SingleProductPanel>
          <SingleProductPanel testId="product-tab-governance-content">
            <div className="flex flex-col gap-y-3 my-4">
              {!isEmpty(governance)
                ? governance.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-x-4 rounded-full cursor-pointer shadow-md p-3 text-sm"
                      onClick={() => window.open(item.url)}
                    >
                      {item && item.timestamp && (
                        <p className="text-sub-dark text-sm">
                          {new Date(item.timestamp).toLocaleDateString(
                            'en-GB',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )}
                        </p>
                      )}
                      {item && item.status && (
                        <p className="font-medium text-primary border border-secondary rounded-full px-3">
                          {item.status}
                        </p>
                      )}
                      {item && item.title && (
                        <p className="text-primary">{item.title}</p>
                      )}
                    </div>
                  ))
                : t('noGovernance')}
            </div>
          </SingleProductPanel>
        </Tab.Panels>
      </Tab.Group>
    </div>
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
    <AnimateSharedLayout>
      <AnimatePresence>
        <Tab.Panel
          as={motion.div}
          className="rounded-lg bg-gradient-primary p-3 shadow-md"
          layout
        >
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
      </AnimatePresence>
    </AnimateSharedLayout>
  );
}

export function KeyFact({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: string;
}) {
  const { t } = useTranslation();
  return (
    <li className="flex justify-between gap-x-2">
      <p className="flex flex-col">
        <span className="font-bold text-primary">{t(title)}</span>
        <span className="text-sub-dark">{t(description)}</span>
      </p>
      <p className="text-sub-dark text-right" data-cy={`key-${title}`}>
        {value ? value : 'N/A'}
      </p>
    </li>
  );
}
