import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { Parser } from '@json2csv/plainjs';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloudDownloadIcon,
} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import Tooltip from '../../components/Tooltip/Tooltip';
import { useAppSelector } from '../../hooks';
import {
  useClaimedRewards,
  useTotalActiveRewards,
} from '../../hooks/useRewards';
import classNames from '../../utils/classnames';
import ARVImage from '../../public/tokens/32x32/ARV.svg';
import PRVImage from '../../public/tokens/32x32/PRV.svg';
import ThreeDots from '../../public/images/icons/three-dots.svg';
import weth from '../../public/images/icons/weth.svg';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import * as Checkbox from '@radix-ui/react-checkbox';
import * as Label from '@radix-ui/react-label';
import { formatBalance } from '../../utils/formatBalance';
import { Month } from '../../store/rewards/rewards.types';
import { isEmpty } from 'lodash';

type Reward = {
  source: 'PRV' | 'ARV';
  claimDate: Date;
  amount: number;
};

const sampleData: Reward[] = [
  {
    source: 'PRV',
    claimDate: new Date('2021-09-01'),
    amount: 100,
  },
  {
    source: 'PRV',
    claimDate: new Date('2021-10-02'),
    amount: 200,
  },
  {
    source: 'ARV',
    claimDate: new Date('2021-10-02'),
    amount: 300,
  },
  {
    source: 'ARV',
    claimDate: new Date('2021-11-02'),
    amount: 400,
  },
];

const columnHelper = createColumnHelper<Reward>();

const sortingComponents = {
  asc: <ChevronUpIcon className="w-4 h-4" />,
  desc: <ChevronDownIcon className="w-4 h-4" />,
  false: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  ),
};

const RewardsHistory = () => {
  const { t } = useTranslation();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const claimedRewards = useClaimedRewards() as {
    ARV: Month[];
    PRV: Month[];
  };
  const shapeData = useMemo(() => {
    if (isEmpty(claimedRewards)) return [];
    return Object.entries(claimedRewards)
      .map(([key, value]: [string, Month[]]) => {
        return value.map((item) => ({
          source: key as 'PRV' | 'ARV',
          claimDate: new Date(item.month),
          amount: item.rewards.label,
        }));
      })
      .flat();
  }, [claimedRewards]);

  const columns = useMemo<ColumnDef<Reward>[]>(
    () => [
      columnHelper.accessor((row) => row.source, {
        header: 'rewardSource',
        cell: (info) => {
          return (
            <div className="flex items-center gap-x-2">
              <div className="flex flex-shrink-0">
                <Image
                  src={info.getValue() === 'ARV' ? ARVImage : PRVImage}
                  alt="reward source"
                  width={24}
                  height={24}
                  priority
                />
              </div>
              <p className="text-primary text-lg font-medium flex gap-x-2">
                {t(
                  info.getValue() === 'ARV'
                    ? 'ActiveRewardVault'
                    : 'PassiveRewardVault',
                )}
              </p>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => row.claimDate, {
        header: 'claimDate',
        cell: (info) =>
          info.renderValue().toLocaleDateString(defaultLocale, {
            month: '2-digit',
            year: 'numeric',
          }),
      }),
      columnHelper.accessor((row) => row.amount, {
        header: 'rewardAmount',
        cell: (info) => info.renderValue(),
      }),
    ],
    [defaultLocale, t],
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  // filtered data
  const [filterTags, setFilterTags] = useState([]);

  const filteredData = useMemo(() => {
    // prevent also to turn off all filters and disable the checkbox
    return shapeData.filter((node) =>
      filterTags.length > 0
        ? filterTags.every(
            (filterTag) =>
              node.source.toLowerCase() !== filterTag.toLowerCase(),
          )
        : shapeData,
    );
  }, [filterTags, shapeData]);

  const [data] = useMemo(() => [filteredData], [filteredData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const downloadCSV = useCallback(() => {
    try {
      const parser = new Parser();
      const transformTimestampOnData = data.map((item) => ({
        ...item,
        claimDate: item.claimDate.toLocaleDateString(defaultLocale, {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }),
      }));
      const csv = parser.parse(transformTimestampOnData);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window?.URL?.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rewards.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  }, [data, defaultLocale]);

  if (isEmpty(claimedRewards?.ARV) && isEmpty(claimedRewards?.PRV)) return null;

  return (
    <div className="mt-4">
      <Tab.Group>
        <div className="flex justify-between items-center gap-x-4">
          <Tab.List className="flex gap-x-4 rounded-xl p-1">
            {['claimedHistory'].map((tab) => {
              return (
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'text-base font-semibold focus:outline-none relative',
                      selected ? ' text-secondary' : ' text-sub-light',
                      'disabled:opacity-20',
                    )
                  }
                  key={tab}
                >
                  {({ selected }) => (
                    <>
                      {t(tab)}
                      {selected && (
                        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary" />
                      )}
                    </>
                  )}
                </Tab>
              );
            })}
          </Tab.List>
        </div>
        <Tab.Panels className="mt-4 h-full">
          <Tab.Panel>
            <div className="w-full flex flex-col shadow-sm rounded-lg bg-gradient-primary overflow-hidden">
              <div className="items-center justify-between w-full px-4 py-2 flex">
                <div className="flex items-center gap-x-2">
                  <h3 className="text-primary text-lg font-semibold flex gap-x-2 items-center">
                    {t('yourRewardsHistory')}
                  </h3>
                </div>
                <div className="flex items-center gap-x-5">
                  <div className="flex gap-x-4 items-center">
                    <p className="text-sm font-primary font-medium">
                      {t('show')}
                    </p>
                    <div className="flex items-center w-full">
                      <Checkbox.Root
                        id="ARV"
                        value={'ARV'}
                        defaultChecked
                        disabled={
                          filterTags.length === 1 && filterTags[0] === 'PRV'
                        }
                        onCheckedChange={(state) => {
                          !state
                            ? setFilterTags([...filterTags, 'ARV'])
                            : setFilterTags(
                                filterTags.filter(
                                  (filterTag) => filterTag !== 'ARV',
                                ),
                              );
                        }}
                        className={classNames(
                          'flex h-4 w-4 items-center justify-center rounded-sm pointer',
                          'radix-state-checked:bg-secondary radix-state-unchecked:bg-light-gray ring-2 ring-offset-2 ring-secondary',
                          'focus:outline-none focus-visible:ring focus-visible:ring-opacity-75',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                      >
                        <Checkbox.Indicator>
                          <CheckIcon className="h-4 w-4 self-center text-white" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <Label.Label
                        htmlFor="ARV"
                        className="ml-3 select-none text-sm font-medium text-primary cursor-pointer"
                      >
                        {t('ARV')}
                      </Label.Label>
                    </div>
                    <div className="flex items-center w-full">
                      <Checkbox.Root
                        id="PRV"
                        value={'PRV'}
                        defaultChecked
                        disabled={
                          filterTags.length === 1 && filterTags[0] === 'ARV'
                        }
                        onCheckedChange={(state) => {
                          !state
                            ? setFilterTags([...filterTags, 'PRV'])
                            : setFilterTags(
                                filterTags.filter(
                                  (filterTag) => filterTag !== 'PRV',
                                ),
                              );
                        }}
                        className={classNames(
                          'flex h-4 w-4 items-center justify-center rounded-sm pointer',
                          'radix-state-checked:bg-secondary radix-state-unchecked:bg-light-gray ring-2 ring-offset-2 ring-secondary',
                          'focus:outline-none focus-visible:ring focus-visible:ring-opacity-75',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                      >
                        <Checkbox.Indicator>
                          <CheckIcon className="h-4 w-4 self-center text-white" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <Label.Label
                        htmlFor="PRV"
                        className="ml-3 select-none text-sm font-medium text-primary cursor-pointer"
                      >
                        {t('PRV')}
                      </Label.Label>
                    </div>
                  </div>
                  <Tooltip
                    icon={
                      <Image
                        src={ThreeDots}
                        width={18}
                        height={18}
                        priority
                        alt="three dots"
                      />
                    }
                  >
                    <div className="flex bg-white rounded-md">
                      <button
                        className="flex items-center gap-x-2"
                        onClick={downloadCSV}
                      >
                        <CloudDownloadIcon className="w-4 h-4" />

                        <span className="text-primary font-medium text-sm">
                          {t('downloadCSV')}
                        </span>
                      </button>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="w-full flex flex-col">
                <div className="hidden items-center mb-2 lg:flex">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <div
                      key={headerGroup.id}
                      className="min-w-0 flex-1 px-6 sm:grid sm:grid-cols-8 sm:gap-4 text-sub-dark text-xs"
                    >
                      {headerGroup.headers.map((header) => {
                        switch (header.id) {
                          case 'rewardSource':
                            return (
                              <div
                                {...{
                                  className: classNames(
                                    header.column.getCanSort()
                                      ? 'cursor-pointer select-none'
                                      : '',
                                    'flex gap-x-2 col-span-3',
                                  ),
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                                key={header.id}
                              >
                                {t(header.column.columnDef.header as string)}
                                {sortingComponents[
                                  header.column.getIsSorted() as string
                                ] ?? null}
                              </div>
                            );
                          case 'claimDate':
                            return (
                              <div
                                {...{
                                  className: classNames(
                                    header.column.getCanSort()
                                      ? 'cursor-pointer select-none'
                                      : '',
                                    'flex gap-x-2 col-span-3',
                                  ),
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                                key={header.id}
                              >
                                {t(header.column.columnDef.header as string)}
                                {sortingComponents[
                                  header.column.getIsSorted() as string
                                ] ?? null}
                              </div>
                            );

                          case 'rewardAmount':
                            return (
                              <div
                                {...{
                                  className: classNames(
                                    header.column.getCanSort()
                                      ? 'cursor-pointer select-none'
                                      : '',
                                    'flex gap-x-2 justify-end col-span-2 text-right',
                                  ),
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                                key={header.id}
                              >
                                {t(header.column.columnDef.header as string)}
                                {sortingComponents[
                                  header.column.getIsSorted() as string
                                ] ?? null}
                              </div>
                            );
                        }
                      })}
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1 flex flex-col items-center w-full px-4 overflow-hidden">
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <div
                        key={row.id}
                        className="min-w-0 flex-1 px-2 flex sm:gap-4 items-center justify-between lg:justify-start lg:grid lg:grid-cols-8 w-full bg-sidebar my-2 py-2 rounded-md gap-x-4"
                      >
                        {row.getVisibleCells().map((cell) => {
                          switch (cell.column.id) {
                            case 'rewardSource':
                              return (
                                <div
                                  key={cell.id}
                                  className="flex flex-col justify-between col-span-3"
                                >
                                  <span className="text-primary text-sm font-medium">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </span>
                                </div>
                              );
                            case 'claimDate':
                              return (
                                <div
                                  key={cell.id}
                                  className="flex flex-col justify-center col-span-3 "
                                >
                                  <span className="text-primary text-sm font-bold">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </span>
                                </div>
                              );
                            case 'rewardAmount':
                              return (
                                <div
                                  key={cell.id}
                                  className="flex col-span-2 gap-x-2 justify-end text-right items-center"
                                >
                                  <div className="flex flex-shrink-0">
                                    <Image
                                      src={weth}
                                      alt="ethereum"
                                      width={24}
                                      height={24}
                                      priority
                                    />
                                  </div>
                                  <p className=" text-primary font-bold text-sm">
                                    {t('WETHAmount', {
                                      amountLabel: formatBalance(
                                        cell.getValue() as number,
                                        defaultLocale,
                                        4,
                                      ),
                                    })}
                                  </p>
                                </div>
                              );
                            default:
                              return (
                                <div key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                  )}
                                </div>
                              );
                          }
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default RewardsHistory;
