// import React, {
//   useRef,
//   useState,
//   useMemo,
//   useEffect,
//   useCallback,
// } from 'react';
// import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
// import { Brush } from '@visx/brush';
// import { Bounds } from '@visx/brush/lib/types';
// import BaseBrush, {
//   BaseBrushState,
//   UpdateBrush,
// } from '@visx/brush/lib/BaseBrush';
// import { Group } from '@visx/group';
// import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
// import { localPoint } from '@visx/event';
// import { Bar, Line } from '@visx/shape';
// import { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
// import { max, extent } from 'd3-array';
// import LineChart from './LineChart';
// import {
//   useLazyGetTokenChartQuery,
//   ChartDataFragment,
// } from '../../api/generated/graphql';
// import { useMediaQuery } from 'usehooks-ts';
// import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
// import { ScaleBand, ScaleLinear } from 'd3-scale';

// const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
// const chartSeparation = 30;
// const GRADIENT_ID = 'brush_gradient';
// export const accentColor = '#f6acc8';
// export const background = '#584153';
// export const background2 = 'rgba(186, 189, 220, 1)';
// const selectedBrushStyle = {
//   fill: `url(#brushGradient) `,
//   stroke: 'transparent',
//   fillOpacity: 0.1,
// };

// type ValueOf<T> = T[keyof T];
// type Index = ValueOf<Pick<ChartDataFragment, 'marketData'>>[0];

// // accessors
// const getDate = (d: Index) => new Date(d.timestamp);
// const getStockValue = (d: Index) => d.currentPrice;
// const getVolume = (d: Index) => d.totalVolume;
// const getTimestamp = (d: Index) => getDate(d).getTime();

// export type BrushProps = {
//   width: number;
//   height: number;
//   margin?: { top: number; right: number; bottom: number; left: number };
//   compact?: boolean;
// };

// type TooltipData = {
//   x0: Date;
//   y0: number;
// };

// function PriceChart({
//   compact = false,
//   symbol,
//   width,
//   height,
//   margin = {
//     top: 20,
//     left: 50,
//     bottom: 20,
//     right: 20,
//   },
//   dataRange,
//   showPrice,
//   showFlags,
//   showNav,
// }: BrushProps & {
//   symbol: string;
//   dataRange: string;
//   showPrice: boolean;
//   showFlags: boolean;
//   showNav: boolean;
// }) {
//   const {
//     tooltipData,
//     tooltipLeft,
//     tooltipTop,
//     tooltipOpen,
//     showTooltip,
//     hideTooltip,
//   } = useTooltip<TooltipData>();

//   const mq = useMediaQuery('(min-width: 640px)');
//   const ready = useServerHandoffComplete();

//   const [trigger, { isLoading, isError, data: priceData, isUninitialized }] =
//     useLazyGetTokenChartQuery();

//   const stock = useMemo(() => {
//     if (isLoading || isError || isUninitialized) {
//       return [
//         {
//           timestamp: new Date().getTime(),
//           currentPrice: 0,
//           nav: 0,
//           totalVolume: 0,
//         },
//         {
//           timestamp: new Date().getTime(),
//           currentPrice: 0,
//           nav: 0,
//           totalVolume: 0,
//         },
//       ];
//     }
//     return priceData?.getTokenChart?.marketData;
//   }, [isLoading, isError, priceData, isUninitialized]);

//   const brushRef = useRef<BaseBrush | null>(null);
//   const [filteredStock, setFilteredStock] = useState(stock);

//   const onBrushChange = (domain: Bounds | null) => {
//     if (!domain || isLoading || isError || isUninitialized) return;
//     const { x0, x1, y0, y1 } = domain;
//     const stockCopy = stock.filter((s) => {
//       const x = getDate(s).getTime();
//       const y = getStockValue(s);
//       return x > x0 && x < x1 && y > y0 && y < y1;
//     });
//     setFilteredStock(stockCopy);
//   };

//   const innerHeight = height - margin.top - margin.bottom;
//   const topChartBottomMargin = compact
//     ? chartSeparation / 2
//     : chartSeparation + 10;
//   const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
//   const volumeChartHeight =
//     topChartHeight + 0.3 * innerHeight - topChartBottomMargin;
//   const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

//   // bounds
//   const xMax = Math.max(width - margin.left - margin.right, 0);
//   const yMax = Math.max(topChartHeight, 0);
//   const yVolumeMax = Math.max(volumeChartHeight, 0);
//   const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
//   const yBrushMax = Math.max(
//     bottomChartHeight - brushMargin.top - brushMargin.bottom,
//     0,
//   );

//   // scales
//   const dateScale = useMemo(
//     () =>
//       scaleTime<number>({
//         range: [0, xMax],
//         domain: extent(filteredStock, getDate) as [Date, Date],
//       }),
//     [xMax, filteredStock],
//   );

//   // And then scale the graph by our data
//   const xScale = scaleBand({
//     range: [0, xMax],
//     round: true,
//     domain: filteredStock.map((t) => getTimestamp(t)),
//     padding: 0.4,
//   });
//   const yScale = scaleLinear({
//     range: [yMax, 0],
//     round: true,
//     domain: [0, Math.max(...filteredStock.map(getVolume))],
//   });

//   const stockScale = useMemo(
//     () =>
//       scaleLinear<number>({
//         range: [yMax, 0],
//         domain: [0, max(filteredStock, getStockValue) || 0],
//         nice: true,
//       }),
//     [yMax, filteredStock],
//   );
//   const brushDateScale = useMemo(
//     () =>
//       scaleTime<number>({
//         range: [0, xBrushMax],
//         domain: extent(stock, getDate) as [Date, Date],
//       }),
//     [stock, xBrushMax],
//   );
//   const brushStockScale = useMemo(
//     () =>
//       scaleLinear({
//         range: [yBrushMax, 0],
//         domain: [0, max(stock, getStockValue) || 0],
//         nice: true,
//       }),
//     [stock, yBrushMax],
//   );

//   const initialBrushPosition = useMemo(
//     () => ({
//       start: { x: brushDateScale(getDate(stock[0])) },
//       end: { x: brushDateScale(getDate(stock[stock.length - 1])) },
//     }),
//     [brushDateScale, stock],
//   );

//   const handleResetClick = useCallback(() => {
//     if (brushRef?.current) {
//       const updater: UpdateBrush = (prevBrush) => {
//         const newExtent = brushRef.current?.getExtent(
//           initialBrushPosition.start,
//           initialBrushPosition.end,
//         );

//         const newState: BaseBrushState = {
//           ...prevBrush,
//           start: { y: newExtent.y0, x: newExtent.x0 },
//           end: { y: newExtent.y1, x: newExtent.x1 },
//           extent: newExtent,
//         };

//         return newState;
//       };
//       brushRef.current.updateBrush(updater);
//     }
//   }, [brushRef, initialBrushPosition]);

//   const { containerRef, TooltipInPortal } = useTooltipInPortal({
//     // use TooltipWithBounds to prevent tooltip from being rendered outside of the chart
//     detectBounds: true,
//     // when tooltip containers are scrolled, this will correctly update the Tooltip position
//     scroll: true,
//   });

//   const handleTooltip = useCallback(
//     (
//       event:
//         | React.TouchEvent<SVGRectElement>
//         | React.MouseEvent<SVGRectElement>,
//     ) => {
//       if (!mq && ready) return;
//       const { x, y } = localPoint(event) || { x: 0, y: 0 };
//       const x0 = dateScale.invert(x);
//       const y0 = stockScale.invert(y) + 50;

//       showTooltip({
//         tooltipData: { x0, y0 },
//         tooltipLeft: x,
//         tooltipTop: y,
//       });
//     },
//     [dateScale, mq, ready, showTooltip, stockScale],
//   );

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const { getTokenChart } = await trigger(
//           {
//             symbol,
//             currency: 'USD',
//             interval: dataRange,
//           },
//           true,
//         ).unwrap();
//         setFilteredStock(getTokenChart.marketData);
//         handleResetClick();
//       } catch (error) {
//         console.error('rejected', error);
//       }
//     }
//     fetchData();
//   }, [dataRange, handleResetClick, stock, symbol, trigger]);

//   const compose =
//     (
//       scale: ScaleBand<number> | ScaleLinear<number, number, never>,
//       accessor: any,
//     ) =>
//     (d: Index) =>
//       scale(accessor(d));
//   const xPoint = compose(xScale, getTimestamp);
//   const yPoint = compose(yScale, getVolume);

//   if (isUninitialized || isLoading || isError) return null;
//   return (
//     <>
//       <div>
//         <svg width={width} height={height} ref={containerRef}>
//           <linearGradient id="brushGradient">
//             <stop stopColor="#681157" offset="53%" />
//             <stop stopColor="#40287E" offset="78%" />
//             <stop stopColor="#068B93" offset="126%" />
//           </linearGradient>
//           <rect
//             x={0}
//             y={0}
//             width={width}
//             height={height}
//             fill={`url(#${GRADIENT_ID})`}
//             rx={14}
//           />
//           <LineChart
//             hideBottomAxis={compact}
//             data={filteredStock}
//             showPrice={showPrice}
//             showFlags={showFlags}
//             width={width}
//             margin={{ ...margin, bottom: topChartBottomMargin }}
//             yMax={yMax}
//             xScale={dateScale}
//             yScale={stockScale}
//             gradientColor={background2}
//             handleTooltip={handleTooltip}
//             hideTooltip={hideTooltip}
//             showNav={showNav}
//             symbol={symbol}
//           />
//           {/* <Group width={width}>
//             {filteredStock.map((d, i) => {
//               const barHeight = yMax - yPoint(d);
//               console.log(xScale);
//               console.log(dateScale);
//               return (
//                 <Group key={`bar-${Math.random()}`}>
//                   <Bar
//                     x={xPoint(d)}
//                     y={yMax - barHeight}
//                     height={barHeight}
//                     width={xScale.bandwidth()}
//                     fill="grey"
//                   />
//                 </Group>
//               );
//             })}
//           </Group> */}
//           <LineChart
//             hideBottomAxis
//             hideLeftAxis
//             noAnimation
//             showPrice={showPrice}
//             showFlags={false}
//             data={stock}
//             width={width}
//             yMax={yBrushMax}
//             xScale={brushDateScale}
//             yScale={brushStockScale}
//             margin={brushMargin}
//             top={topChartHeight + topChartBottomMargin + margin.top}
//             gradientColor={background2}
//           >
//             <>
//               <Brush
//                 xScale={brushDateScale}
//                 yScale={brushStockScale}
//                 width={xBrushMax}
//                 height={yBrushMax}
//                 margin={brushMargin}
//                 handleSize={14}
//                 innerRef={brushRef}
//                 resizeTriggerAreas={['left', 'right']}
//                 brushDirection="horizontal"
//                 initialBrushPosition={initialBrushPosition}
//                 onChange={onBrushChange}
//                 onClick={() => setFilteredStock(stock)}
//                 selectedBoxStyle={selectedBrushStyle}
//                 useWindowMoveEvents
//                 renderBrushHandle={(props) => <BrushHandle {...props} />}
//               />
//             </>
//           </LineChart>
//           {tooltipData && (
//             <g>
//               {tooltipData.y0 >= 0 && (
//                 <Line
//                   from={{ x: tooltipLeft, y: tooltipTop }}
//                   to={{ x: tooltipLeft, y: yMax + margin.top }}
//                   stroke={background2}
//                   strokeWidth={1}
//                   pointerEvents="none"
//                   strokeDasharray="6,3"
//                 />
//               )}
//               {tooltipData.y0 >= 0 && (
//                 <Line
//                   from={{ y: tooltipTop, x: margin.left }}
//                   to={{ y: tooltipTop, x: tooltipLeft }}
//                   stroke={background2}
//                   strokeWidth={1}
//                   pointerEvents="none"
//                   strokeDasharray="6,3"
//                 />
//               )}
//             </g>
//           )}
//         </svg>
//       </div>
//       {tooltipOpen && tooltipData.y0 >= 0 && (
//         <>
//           <TooltipInPortal
//             // set this to random so it correctly updates with parent bounds
//             key={Math.random()}
//             top={tooltipTop - margin.top}
//             left={0}
//             className="absolute bg-gradient-primary rounded-full shadow-card text-xs px-2 py-1 font-normal"
//             unstyled
//           >
//             <strong>{tooltipData.y0.toFixed(2)}</strong>
//           </TooltipInPortal>
//         </>
//       )}
//       {tooltipOpen && tooltipData.y0 >= 0 && (
//         <TooltipInPortal
//           // set this to random so it correctly updates with parent bounds
//           key={Math.random()}
//           top={topChartHeight + margin.top}
//           // remove half of the current element width to center
//           className="absolute bg-gradient-primary rounded-full shadow-card text-xs px-2 py-1 font-normal w-32 text-center"
//           left={tooltipLeft - 64}
//           unstyled
//         >
//           <strong>
//             {new Date(tooltipData.x0).toLocaleDateString('en-GB', {
//               year: 'numeric',
//               month: 'long',
//               day: 'numeric',
//             })}
//           </strong>
//         </TooltipInPortal>
//       )}
//     </>
//   );
// }

// // We need to manually offset the handles for them to be rendered at the right position
// const BrushHandle = ({ x, height, isBrushActive }: BrushHandleRenderProps) => {
//   const pathHeight = 15;
//   if (!isBrushActive) {
//     return null;
//   }
//   return (
//     <Group
//       left={x + 2}
//       top={(height - pathHeight) / 2}
//       className="cursor-ew-resize"
//     >
//       <rect
//         width="9.92202"
//         height="14.37818"
//         x=".10445"
//         y=".29058"
//         fill="#fff"
//         rx="5.26965"
//       />
//       <path
//         stroke="#7378A5"
//         d="M3.14931 10.02512v-5.0909m3.8323 5.0909v-5.0909"
//       />
//     </Group>
//   );
// };

// export default PriceChart;

export {};
