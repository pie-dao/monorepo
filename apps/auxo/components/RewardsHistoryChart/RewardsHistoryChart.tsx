import { max } from 'd3-array';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useMemo, useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import Image from 'next/image';
import ethLogo from '../../public/chains/ethereum.svg';
import { useAppSelector } from '../../hooks';
import { useClaimedRewards } from '../../hooks/useRewards';
import { Month } from '../../store/rewards/rewards.types';
import { formatBalance } from '../../utils/formatBalance';
import classNames from '../../utils/classnames';
import { isEmpty } from 'lodash';

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation();
  const { defaultLocale } = useAppSelector((state) => state.preferences);

  if (active && payload && payload.length) {
    const total = payload[0].value + payload[1].value;
    return (
      <div className="bg-white rounded-lg shadow-md py-4 px-3 w-64 gap-y-1 flex flex-col">
        <div className="flex justify-between">
          <p className="text-sm text-primary font-bold">{t('totale')}</p>
          <p className="text-sm text-primary font-bold">
            {formatBalance(total, defaultLocale, 4)} ETH
          </p>
        </div>
        {payload[0]?.value > 0 && (
          <div className="flex justify-between bg-sidebar p-2 rounded-md">
            <div className="text-sm text-primary font-bold flex gap-x-1 items-center">
              <div className="flex flex-shrink-0">
                <Image src={ethLogo} width={24} height={24} alt="ETH" />
              </div>
              <span>
                {formatBalance(payload[0].value, defaultLocale, 4)} ETH
              </span>
            </div>
            <p className="text-sm text-primary font-medium flex gap-x-2 items-center">
              {`${t('from')} ${payload[0].name}`}{' '}
              <span className="flex w-3 h-3 rounded-full bg-secondary"></span>
            </p>
          </div>
        )}
        {payload[1]?.value > 0 && (
          <div className="flex justify-between bg-sidebar p-2 rounded-md">
            <div className="text-sm text-primary font-bold flex gap-x-1 items-center">
              <div className="flex flex-shrink-0">
                <Image src={ethLogo} width={24} height={24} alt="ETH" />
              </div>
              <span>
                {formatBalance(payload[1].value, defaultLocale, 4)} ETH
              </span>
            </div>
            <p className="text-sm text-primary font-medium flex gap-x-2 items-center">
              {`${t('from')} ${payload[1].name}`}
              <span className="flex w-3 h-3 rounded-full bg-primary"></span>
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const RewardsHistoryChart = () => {
  const { data } = useAppSelector((state) => state.rewards);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { t } = useTranslation();

  const getData = useMemo(() => {
    const ArvMonths =
      data?.rewardPositions?.ARV?.map((reward) => reward.month) ?? [];
    const PrvMonths =
      data?.rewardPositions?.PRV?.map((reward) => reward.month) ?? [];
    if (!ArvMonths && !PrvMonths) return null;
    const months = [...new Set([...ArvMonths, ...PrvMonths])];

    return months?.map((month) => {
      const ArvReward = data?.rewardPositions?.ARV?.find(
        (reward) => reward?.month === month,
      )?.rewards?.label;
      const PrvReward = data?.rewardPositions?.PRV?.find(
        (reward) => reward?.month === month,
      )?.rewards?.label;
      return {
        name: new Date(month).toLocaleString(defaultLocale, {
          month: 'short',
          year: 'numeric',
        }),
        ARV: ArvReward || 0,
        PRV: PrvReward || 0,
      };
    });
  }, [data?.rewardPositions?.ARV, data?.rewardPositions?.PRV, defaultLocale]);

  if (isEmpty(getData)) return null;

  return (
    <div className="mt-8">
      <Tab.Group>
        <div className="flex justify-between items-center gap-x-4">
          <Tab.List className="flex gap-x-4 rounded-xl p-1 pb-4 whitespace-nowrap overflow-x-auto scrollbar:w-[2px] scrollbar:h-[2px] scrollbar:bg-white scrollbar:border scrollbar:border-sub-dark scrollbar-track:bg-white scrollbar-thumb:bg-sub-light scrollbar-track:[box-shadow:inset_0_0_1px_rgba(0,0,0,0.4)] scrollbar-track:rounded-full scrollbar-thumb:rounded-full">
            {['earningsOverTime'].map((tab) => {
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
        <Tab.Panels className="mt-4">
          <Tab.Panel className="w-full h-full">
            <div className="flex w-full h-[500px]">
              <ResponsiveContainer width={'99%'} height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={getData}
                  margin={{
                    top: 50,
                    right: 30,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    dy={10}
                    tickLine={false}
                  />
                  <YAxis
                    tickCount={8}
                    tickLine={true}
                    tickSize={8}
                    axisLine={false}
                    domain={[
                      0,
                      max(getData, (d) => (d.ARV + d.PRV).toFixed(2)),
                    ]}
                    tickFormatter={(value) => {
                      return formatBalance(value, defaultLocale, 2, 'standard');
                    }}
                  />
                  <Tooltip cursor={false} content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      marginTop: 10,
                      left: 40,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                  <Bar
                    dataKey="ARV"
                    stackId="a"
                    fill="rgba(11, 120, 221, 1)"
                    barSize={10}
                    shape={roundedBottomBar}
                  />
                  <Bar
                    dataKey="PRV"
                    stackId="a"
                    fill="#82ca9d"
                    barSize={10}
                    shape={roundedTopBar}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

const getPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  radiusPosition: 'top' | 'bottom' | 'both' | 'none',
) => {
  const radius = height > 20 ? 5 : 0;

  switch (radiusPosition) {
    case 'top':
      return `M${x},${y + radius}
            Q${x},${y},${x + radius},${y}
            L${x + width - radius},${y}
            Q${x + width},${y},${x + width},${y + radius}
            L${x + width},${y + height}
            L${x},${y + height}
            Z`;
    case 'bottom':
      return `M${x},${y + height - radius}
            Q${x},${y + height},${x + radius},${y + height}
            L${x + width - radius},${y + height}
            Q${x + width},${y + height},${x + width},${y + height - radius}
            L${x + width},${y}
            L${x},${y}
            Z`;
    case 'both':
      return `M${x},${y + radius}
            Q${x},${y},${x + radius},${y}
            L${x + width - radius},${y}
            Q${x + width},${y},${x + width},${y + radius}
            L${x + width},${y + height - radius}
            Q${x + width},${y + height},${x + width - radius},${y + height}
            L${x + radius},${y + height}
            Q${x},${y + height},${x},${y + height - radius}
            Z`;
    default:
      return `M${x},${y}
            L${x},${y + height}
            L${x + width},${y + height}
            L${x + width},${y}
            Z`;
  }
};

const roundedTopBar = (props) => {
  const { fill, x, y, width, height, pv } = props;
  const shoulbeRoundedBottom = pv === 0 ? 'both' : 'top';
  if (height === 0) return;
  return (
    <path d={getPath(x, y, width, height, 'both')} stroke="none" fill={fill} />
  );
};

const roundedBottomBar = (props) => {
  const { fill, x, y, width, height, uv } = props;
  const isUv = uv !== 0;
  if (height === 0) return;
  const shoulbeRoundedBottom = uv === 0 ? 'bottom' : 'both';

  return (
    <path
      d={getPath(x, isUv ? y : y, width, isUv ? height : height, 'both')}
      stroke="none"
      fill={fill}
    />
  );
};

export default RewardsHistoryChart;
