/* eslint-disable @typescript-eslint/no-explicit-any */
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar, LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import React, { useMemo } from 'react';
import { COLORED_CHART_DATA, LEVEL_CHART_DATA } from '../../utils/constants';
import { curveMonotoneX } from '@visx/curve';
import { AxisBottom } from '@visx/axis';
import { UseIsUserLosingLevel, useUserHasLock } from '../../hooks/useToken';

type Props = {
  width: number;
  height: number;
  level: number;
  showPulse?: boolean;
  levelDifference?: number;
  prefix?: string;
};

export const getLevel = (d: [number, number, string?, string?]): number => d[0];
export const getValue = (d: [number, number, string?, string?]): number => d[1];
export const getColor = (d: [number, number, string?, string?]): string => d[2];

const verticalMargin = 20;

const LevelChart = ({
  width,
  height,
  level,
  levelDifference,
  showPulse = false,
  prefix = '',
}: Props) => {
  const xMax = width;
  const yMax = height - verticalMargin;
  const hasLock = useUserHasLock('ARV');

  const currentLevels = useMemo(() => {
    const levels = COLORED_CHART_DATA.filter((d) => getLevel(d) <= level);
    if (levels.length === 31) {
      return levels;
    }

    const lastLevel = levels[levels.length - 1];
    const newLastLevel: [number, number, string, string] = [
      getLevel(lastLevel),
      getValue(lastLevel),
      'rgba(31, 8, 96, 1)',
      'rgba(31, 8, 96, 1)',
    ];

    const newLevels =
      levelDifference > 0 || !hasLock
        ? levels
        : [...levels.slice(0, -1), newLastLevel];
    return newLevels;
  }, [hasLock, level, levelDifference]);

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<number>({
        range: [0, xMax],
        round: true,
        domain: LEVEL_CHART_DATA.map(getLevel),
        padding: 0,
      }),
    [xMax],
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...LEVEL_CHART_DATA.map(getValue))],
      }),
    [yMax],
  );

  const firstBar = LEVEL_CHART_DATA[0];
  const lastBar = LEVEL_CHART_DATA[LEVEL_CHART_DATA.length - 1];
  const lastBarWidth = xScale.bandwidth();
  const firstBarHeight = yMax - (yScale(getValue(firstBar)) + 3) ?? 0;
  const lastBarHeight = yMax - (yScale(getValue(lastBar)) ?? 0);
  const firstBarX = xScale(getLevel(firstBar));
  const lastBarX = xScale(getLevel(lastBar)) + lastBarWidth;
  const firstBarY = yMax - firstBarHeight;
  const lastBarY = yMax - lastBarHeight;

  const linePoints = [
    [firstBarX, firstBarY],
    [lastBarX, lastBarY],
  ];

  const isLosingLevel = UseIsUserLosingLevel();

  return width < 10 ? null : (
    <svg width={width} height={height}>
      {currentLevels.map((data, index) => (
        <React.Fragment key={index}>
          <rect fill={`url(#${prefix}gradient-${index})`} />
          <defs>
            <linearGradient
              id={`${prefix}gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: data[2], stopOpacity: 1 } as any}
              />
              <stop
                offset="100%"
                style={{ stopColor: data[3], stopOpacity: 1 } as any}
              />
            </linearGradient>
          </defs>
        </React.Fragment>
      ))}
      <AxisBottom
        axisClassName="block"
        tickClassName="block"
        labelClassName="hidden"
        axisLineClassName="hidden"
        top={yMax}
        tickLineProps={{
          fill: '#fff',
          stroke: '#fff',
        }}
        scale={xScale}
        tickLabelProps={() => ({
          fill: 'rgba(115, 120, 165, 1)',
          fontSize: 11,
          textAnchor: 'middle',
        })}
      />
      <Group top={verticalMargin / 2 - 10}>
        {LEVEL_CHART_DATA.map((d) => {
          const level = getLevel(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(getValue(d)) ?? 0);
          const barX = xScale(level);
          const barY = yMax - barHeight;
          return (
            <Bar
              key={`bar-${level}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(186, 189, 220, 1)"
            />
          );
        })}
        {currentLevels?.map((d, i) => {
          const lastLevel = currentLevels[currentLevels.length - 1];
          const level = getLevel(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(getValue(d)) ?? 0);
          const barX = xScale(level);
          const barY = yMax - barHeight;

          return (
            <Bar
              key={`bar-${level}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={`url(#${prefix}gradient-${i})`}
              className={
                ((isLosingLevel && lastLevel[0] === level && showPulse) ||
                  i >= levelDifference) &&
                'animate-pulse-fast'
              }
            />
          );
        })}
        <LinePath
          data={linePoints}
          x={(d) => d[0]}
          y={(d) => d[1]}
          stroke="#fff"
          strokeWidth={10}
          curve={curveMonotoneX}
        />
      </Group>
    </svg>
  );
};

export default LevelChart;
