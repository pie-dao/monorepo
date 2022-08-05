import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { scaleTime, scaleLinear } from '@visx/scale';
import { Brush } from '@visx/brush';
import { Bounds } from '@visx/brush/lib/types';
import BaseBrush, {
  BaseBrushState,
  UpdateBrush,
} from '@visx/brush/lib/BaseBrush';
import { Group } from '@visx/group';
import { max, extent } from 'd3-array';
import LineChart from './LineChart';
import { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import {
  useLazyGetTokenChartQuery,
  ChartDataFragment,
} from '../../api/generated/graphql';
import classNames from '../../utils/classnames';
import { motion } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Line } from '@visx/shape';
import { useBoolean } from 'usehooks-ts';

const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 30;
const GRADIENT_ID = 'brush_gradient';
export const accentColor = '#f6acc8';
export const background = '#584153';
export const background2 = 'rgba(186, 189, 220, 1)';
const selectedBrushStyle = {
  fill: `url(#brushGradient) `,
  stroke: 'transparent',
  fillOpacity: 0.1,
};

type ValueOf<T> = T[keyof T];
type Index = ValueOf<Pick<ChartDataFragment, 'marketData'>>[0];

// accessors
const getDate = (d: Index) => new Date(d.timestamp);
const getStockValue = (d: Index) => d.currentPrice;

export type BrushProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  compact?: boolean;
};

function PriceChart({
  compact = false,
  symbol,
  width,
  height,
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
}: BrushProps & { symbol: string }) {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip({
    tooltipData: {
      x0: new Date(),
      y0: 0,
    },
  });

  const { value: showNav, toggle: toggleNav } = useBoolean(false);
  const { value: showFlags, toggle: toggleFlags } = useBoolean(true);

  const { t } = useTranslation();
  const [trigger, { isLoading, isError, data: priceData, isUninitialized }] =
    useLazyGetTokenChartQuery();

  const stock = useMemo(() => {
    if (isLoading || isError || isUninitialized) {
      return [
        {
          timestamp: new Date().getTime(),
          currentPrice: 0,
          nav: 0,
        },
        {
          timestamp: new Date().getTime(),
          currentPrice: 0,
          nav: 0,
        },
      ];
    }
    return priceData?.getTokenChart?.marketData;
  }, [isLoading, isError, priceData, isUninitialized]);

  const dataRanges = ['1D', '1W', '1M', '1Y', 'ALL'];
  const [dataRange, setDataRange] = useState(
    dataRanges.find((d) => d === '1Y'),
  );

  const brushRef = useRef<BaseBrush | null>(null);
  const [filteredStock, setFilteredStock] = useState(stock);

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain || isLoading || isError || isUninitialized) return;
    const { x0, x1, y0, y1 } = domain;
    const stockCopy = stock.filter((s) => {
      const x = getDate(s).getTime();
      const y = getStockValue(s);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredStock(stockCopy);
  };

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = compact
    ? chartSeparation / 2
    : chartSeparation + 10;
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0,
  );

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xMax],
        domain: extent(filteredStock, getDate) as [Date, Date],
      }),
    [xMax, filteredStock],
  );
  const stockScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        domain: [0, max(filteredStock, getStockValue) || 0],
        nice: true,
      }),
    [yMax, filteredStock],
  );
  const brushDateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xBrushMax],
        domain: extent(stock, getDate) as [Date, Date],
      }),
    [stock, xBrushMax],
  );
  const brushStockScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, max(stock, getStockValue) || 0],
        nice: true,
      }),
    [stock, yBrushMax],
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(getDate(stock[0])) },
      end: { x: brushDateScale(getDate(stock[stock.length - 1])) },
    }),
    [brushDateScale, stock],
  );

  const handleResetClick = useCallback(() => {
    if (brushRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        const newExtent = brushRef.current?.getExtent(
          initialBrushPosition.start,
          initialBrushPosition.end,
        );

        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: newExtent.y0, x: newExtent.x0 },
          end: { y: newExtent.y1, x: newExtent.x1 },
          extent: newExtent,
        };

        return newState;
      };
      brushRef.current.updateBrush(updater);
    }
  }, [brushRef, initialBrushPosition]);

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // use TooltipWithBounds to prevent tooltip from being rendered outside of the chart
    detectBounds: false,
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
  });

  const handleTooltip = useCallback(
    (
      event:
        | React.TouchEvent<SVGRectElement>
        | React.MouseEvent<SVGRectElement>,
    ) => {
      const { x, y } = localPoint(event) || { x: 0, y: 0 };
      const x0 = dateScale.invert(x);
      const y0 = stockScale.invert(y) + 50;

      showTooltip({
        tooltipData: { x0, y0 },
        tooltipLeft: x,
        tooltipTop: y,
      });
    },
    [dateScale, showTooltip, stockScale],
  );

  const handleChartTime = (interval: string) => {
    trigger({
      symbol,
      currency: 'USD',
      interval,
    });
    setDataRange(interval);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { getTokenChart } = await trigger(
          {
            symbol,
            currency: 'USD',
            interval: dataRange,
          },
          true,
        ).unwrap();
        setFilteredStock(getTokenChart.marketData);
        handleResetClick();
      } catch (error) {
        console.error('rejected', error);
      }
    }
    fetchData();
  }, [dataRange, handleResetClick, stock, symbol, trigger]);

  if (isUninitialized || isLoading || isError) return null;
  return (
    <>
      <div>
        <div className="flex gap-x-4 justify-around bg-gradient-primary rounded-full shadow-card w-full sm:w-fit px-4 py-1 text-xs ml-auto mb-12">
          {dataRanges.map((range) => (
            <motion.div
              onClick={() => handleChartTime(range)}
              className={classNames(
                'relative cursor-pointer',
                dataRange === range && 'text-secondary',
              )}
              key={range}
            >
              {t(range)}
              {dataRange === range && (
                <motion.div
                  className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-secondary"
                  layoutId={`underline-shared`}
                />
              )}
            </motion.div>
          ))}
        </div>
        <svg width={width} height={height} ref={containerRef}>
          <linearGradient id="brushGradient">
            <stop stopColor="#681157" offset="53%" />
            <stop stopColor="#40287E" offset="78%" />
            <stop stopColor="#068B93" offset="126%" />
          </linearGradient>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={`url(#${GRADIENT_ID})`}
            rx={14}
          />
          <LineChart
            hideBottomAxis={compact}
            data={filteredStock}
            showFlags={showFlags}
            width={width}
            margin={{ ...margin, bottom: topChartBottomMargin }}
            yMax={yMax}
            xScale={dateScale}
            yScale={stockScale}
            gradientColor={background2}
            handleTooltip={handleTooltip}
            hideTooltip={hideTooltip}
            showNav={showNav}
            symbol={symbol}
          />
          <LineChart
            hideBottomAxis
            hideLeftAxis
            noAnimation
            showFlags={false}
            data={stock}
            width={width}
            yMax={yBrushMax}
            xScale={brushDateScale}
            yScale={brushStockScale}
            margin={brushMargin}
            top={topChartHeight + topChartBottomMargin + margin.top}
            gradientColor={background2}
          >
            <Brush
              xScale={brushDateScale}
              yScale={brushStockScale}
              width={xBrushMax}
              height={yBrushMax}
              margin={brushMargin}
              handleSize={14}
              innerRef={brushRef}
              resizeTriggerAreas={['left', 'right']}
              brushDirection="horizontal"
              initialBrushPosition={initialBrushPosition}
              onChange={onBrushChange}
              onClick={() => setFilteredStock(stock)}
              selectedBoxStyle={selectedBrushStyle}
              useWindowMoveEvents
              renderBrushHandle={(props) => <BrushHandle {...props} />}
            />
          </LineChart>
          {tooltipData && (
            <g>
              {tooltipData.y0 >= 0 && (
                <Line
                  from={{ x: tooltipLeft, y: tooltipTop }}
                  to={{ x: tooltipLeft, y: yMax + margin.top }}
                  stroke={background2}
                  strokeWidth={1}
                  pointerEvents="none"
                  strokeDasharray="6,3"
                />
              )}
              {tooltipData.y0 >= 0 && (
                <Line
                  from={{ y: tooltipTop, x: margin.left }}
                  to={{ y: tooltipTop, x: tooltipLeft }}
                  stroke={background2}
                  strokeWidth={1}
                  pointerEvents="none"
                  strokeDasharray="6,3"
                />
              )}
            </g>
          )}
        </svg>
      </div>
      {tooltipOpen && tooltipData.y0 >= 0 && (
        <>
          <TooltipInPortal
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop - margin.top}
            left={0}
            className="absolute bg-gradient-primary rounded-full shadow-card text-xs px-2 py-1 font-normal"
            unstyled
          >
            <strong>{tooltipData.y0.toFixed(2)}</strong>
          </TooltipInPortal>
        </>
      )}
      {tooltipOpen && tooltipData.y0 >= 0 && (
        <TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={topChartHeight + margin.top}
          // remove half of the current element width to center
          className="absolute bg-gradient-primary rounded-full shadow-card text-xs px-2 py-1 font-normal w-32 text-center"
          left={tooltipLeft - 64}
          unstyled
        >
          <strong>
            {new Date(tooltipData.x0).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </strong>
        </TooltipInPortal>
      )}
      <input type="checkbox" checked={showFlags} onChange={toggleFlags}></input>
      <input type="checkbox" checked={showNav} onChange={toggleNav}></input>
    </>
  );
}

// We need to manually offset the handles for them to be rendered at the right position
const BrushHandle = ({ x, height, isBrushActive }: BrushHandleRenderProps) => {
  const pathHeight = 15;
  if (!isBrushActive) {
    return null;
  }
  return (
    <Group left={x - 1} top={(height - pathHeight) / 2}>
      <rect
        width="9.92202"
        height="14.37818"
        x=".10445"
        y=".29058"
        fill="#fff"
        rx="5.26965"
      />
      <path
        stroke="#7378A5"
        d="M3.14931 10.02512v-5.0909m3.8323 5.0909v-5.0909"
      />
    </Group>
  );
};

export default PriceChart;
