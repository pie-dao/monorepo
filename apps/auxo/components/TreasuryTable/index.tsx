import { Tab } from '@headlessui/react';
import { motion, Variants } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';
import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';
import PieChart from '../PieChart';
import { DownloadIcon } from '@heroicons/react/outline';
import { useStrapiCollection } from '../../hooks';
import { TypesMap } from '../../types/cmsTypes';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {
  GlpStat_OrderBy,
  OrderDirection,
  useGetGlpStatsQuery,
} from '../../api/generated/graphql';
import MultisigAddresses from '../../config/daoContracts.json';

import { isEmpty } from 'lodash';
import { Fragment } from 'react';
import { chainMap } from '../../utils/networks';
import { getExplorer } from '@shared/util-blockchain/abis';
import ChainIcons from '../ChainIcons/ChainIcons';

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

export type TreasuryTabsProps = {
  downloadUrl?: string;
};

export function TreasuryTabs(
  props: TreasuryTabsProps,
): React.ReactElement<TreasuryTabsProps> {
  const { t } = useTranslation();

  const { data, isLoading: isBreakdownLoading } =
    useStrapiCollection<TypesMap['breakdowns']>('breakdowns');

  const { data: news, isLoading: isNewsLoading } = useStrapiCollection<
    TypesMap['updates']
  >('updates', {
    'sort[0]': 'createdAt:desc',
    'pagination[page]': 1,
    'pagination[pageSize]': 3,
  });

  return (
    <section className="w-full bg-background mt-6">
      <Tab.Group>
        <Tab.List className="md:flex ml-[10px] md:max-w-xs gap-x-2 grid grid-cols-1 w-full">
          {['About'].map((title) => (
            <Tab
              className={({ selected }) =>
                classNames(
                  'md:w-fit py-2 text-md font-medium leading-5 focus:outline-none relative text-center',
                  !selected && 'text-sub-light',
                  selected && 'text-secondary',
                )
              }
              key={title}
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

        <Tab.Panels className="bg-gradient-primary shadow-md rounded-lg p-4 overflow-hidden mt-4">
          <SingleProductPanel className="divide-y">
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-y-8 divide-gray-200">
                  <div className="text-primary text-base">
                    {t('treasuryDescription')}
                  </div>
                  <div className="flex flex-col gap-y-6">
                    <div className="flex flex-col gap-y-3">
                      <h3 className="text-base text-primary font-medium">
                        {t('multisigAddresses')}
                      </h3>
                      <dl className="flex flex-col space-y-4 mt-2">
                        {!isEmpty(MultisigAddresses?.multisigs?.treasury)
                          ? Object.entries(
                              MultisigAddresses?.multisigs?.treasury,
                            ).map(([key, value]) => (
                              <div className="flex flex-col gap-2" key={key}>
                                <dt className="text-sm font-medium text-primary flex gap-x-2 items-center">
                                  <div className="flex flex-shrink-0">
                                    <ChainIcons
                                      chainId={Number(key)}
                                      svgProps={{
                                        className: 'w-5 h-5 text-primary',
                                      }}
                                    />
                                  </div>
                                  {chainMap[Number(key)].chainName}
                                </dt>
                                <dd className="text-primary hover:text-secondary text-base truncate">
                                  <a
                                    href={`${
                                      getExplorer(Number(key))[0].url
                                    }/address/${value}`}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                  >
                                    {value}
                                  </a>
                                </dd>
                              </div>
                            ))
                          : null}
                      </dl>
                    </div>
                    {/* <div className="grid grid-cols-2 gap-y py-2 items-center ">
                      <p className="text-base text-primary font-medium">
                        {t('treasuryReport')}
                      </p>
                      <a
                        className="w-fit px-5 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary hover:bg-secondary hover:text-white flex gap-x-2 items-center cursor-pointer place-self-end"
                        target="_blank"
                        rel="noreferrer noopener"
                        href={`${props.downloadUrl}`}
                      >
                        <DownloadIcon className="w-5 h-5" />
                        <span className="font-medium">Download</span>
                      </a>
                    </div> */}
                  </div>
                </div>
                <div className="w-full h-full">
                  {isBreakdownLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <ParentSize>
                      {({ width }) => (
                        <PieChart
                          width={width}
                          height={280}
                          data={data?.data?.map((item) => ({
                            label: item.attributes.label,
                            value: item.attributes.value,
                          }))}
                        />
                      )}
                    </ParentSize>
                  )}
                </div>
              </div>
            </>
          </SingleProductPanel>
          <SingleProductPanel
            className="flex flex-col space-y-3 divide-y border-custom-border"
            testId="product-tab-description-content"
          >
            {!isEmpty(news) &&
              news?.data?.map((newsItem) => (
                <div
                  key={newsItem?.attributes?.title}
                  className="flex items-center gap-x-4 p-2"
                >
                  <div className="flex flex-col gap-y-3 text-primary">
                    <div className="flex gap-x-2 items-center">
                      <IconSwitcher icon={newsItem?.attributes?.type} />
                      <h2 className="text-lg font-semibold">
                        {newsItem?.attributes?.title}
                      </h2>
                    </div>
                    <p className="text-sm text-primary">
                      {newsItem?.attributes?.text}
                    </p>
                  </div>
                </div>
              ))}
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

export const IconSwitcher = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'hot':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-sub-dark"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10l2.586-2.586a1 1 0 011.414 0L12 10l5.414-5.414a1 1 0 011.414 0L21 10m-9 4v7a1 1 0 01-1.447.894L9 18H6a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v1zm9 0v7a1 1 0 01-1.447.894L18 18h-3a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v1z"
          />
        </svg>
      );
    case 'flag':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-sub-dark"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-sub-dark"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
          />
        </svg>
      );
  }
};
