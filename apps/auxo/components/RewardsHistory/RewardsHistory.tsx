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
import { sanitizeDate } from '../../utils/date';

type Reward = {
  source: 'PRV' | 'ARV';
  claimDate: Date;
  amount: number;
};

const checkboxes = ['ARV', 'PRV'];

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
      .filter(([key, value]: [string, Month[]]) => value !== undefined)
      .map(([key, value]: [string, Month[]]) => {
        return value?.map((item) => ({
          source: key as 'PRV' | 'ARV',
          claimDate: new Date(sanitizeDate(item?.month)),
          amount: item?.rewards?.label,
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
                {t(info.getValue())}
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
          <Tab.List className="flex gap-x-4 pb-4 whitespace-nowrap overflow-x-auto scrollbar:w-[2px] scrollbar:h-[2px] scrollbar:bg-white scrollbar:border scrollbar:border-sub-dark scrollbar-track:bg-white scrollbar-thumb:bg-sub-light scrollbar-track:[box-shadow:inset_0_0_1px_rgba(0,0,0,0.4)] scrollbar-track:rounded-full scrollbar-thumb:rounded-full ml-[10px]">
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
              <div className="lg:items-center justify-between w-full px-4 py-2 flex flex-col lg:flex-row gap-3">
                <div className="flex justify-between gap-x-2 w-full items-center">
                  <h3 className="text-primary text-base font-semibold flex gap-x-2 items-center">
                    {t('yourRewardsHistory')}
                  </h3>
                  <Tooltip
                    className="block lg:hidden"
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
                <div className="flex items-center gap-x-5">
                  <div className="flex gap-x-4 items-center">
                    <p className="text-sm font-primary font-medium">
                      {t('show')}
                    </p>
                    {checkboxes.map((checkbox) => (
                      <div className="flex items-center w-full" key={checkbox}>
                        <Checkbox.Root
                          id={checkbox}
                          value={checkbox}
                          defaultChecked
                          disabled={
                            filterTags.length === 1 &&
                            filterTags[0] !== checkbox
                          }
                          onCheckedChange={(state) => {
                            !state
                              ? setFilterTags([...filterTags, checkbox])
                              : setFilterTags(
                                  filterTags.filter(
                                    (filterTag) => filterTag !== checkbox,
                                  ),
                                );
                          }}
                          className={classNames(
                            'flex h-4 w-4 items-center justify-center rounded-sm pointer',
                            'radix-state-checked:bg-secondary radix-state-unchecked:bg-sub-dark ring-offset-2 ring-secondary',
                            'focus:outline-none focus-visible:ring focus-visible:ring-opacity-75',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                          )}
                        >
                          <Checkbox.Indicator>
                            <CheckIcon className="h-4 w-4 self-center text-white" />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                        <Label.Label
                          htmlFor={checkbox}
                          className="ml-3 select-none text-sm font-medium text-primary cursor-pointer"
                        >
                          {t(checkbox)}
                        </Label.Label>
                      </div>
                    ))}
                  </div>
                  <Tooltip
                    className="hidden lg:block"
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
                        className="min-w-0 flex-1 flex-wrap flex flex-row gap-4 justify-between lg:justify-start lg:grid lg:grid-cols-8 w-full bg-sidebar my-2 p-2 rounded-lg gap-x-4"
                      >
                        {row.getVisibleCells().map((cell) => {
                          switch (cell.column.id) {
                            case 'rewardSource':
                              return (
                                <div
                                  key={cell.id}
                                  className="flex w-fit flex-col justify-between col-span-3 order-2 lg:order-none gap-x-1 gap-y-2"
                                >
                                  <div className="flex lg:hidden">
                                    <span className="text-sub-dark text-xs">
                                      {t('rewardsSource')}
                                    </span>
                                  </div>
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
                                  className="flex w-full lg:flex-col justify-start lg:justify-center col-span-3 order-1 lg:order-none gap-x-1"
                                >
                                  <span className="flex lg:hidden text-primary text-lg font-semibold">
                                    {t('claimed')}
                                  </span>
                                  <span className="text-primary text-lg lg:text-sm font-semibold">
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
                                  className="flex flex-col w-fit lg:w-full col-span-2 text-right items-end order-2 lg:order-none gap-y-2"
                                >
                                  <div className="flex lg:hidden">
                                    <span className="text-sub-dark text-xs">
                                      {t('rewardsAmount')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-x-2 w-full justify-end">
                                    <div className="hidden lg:flex flex-shrink-0">
                                      <Image
                                        src={weth}
                                        alt="ethereum"
                                        width={24}
                                        height={24}
                                        priority
                                      />
                                    </div>
                                    <p className="text-primary text-lg lg:text-sm font-semibold">
                                      {t('WETHAmount', {
                                        amountLabel: formatBalance(
                                          cell.getValue() as number,
                                          defaultLocale,
                                          4,
                                        ),
                                      })}
                                    </p>
                                  </div>
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
