/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useCallback } from "react";
import { LinePath, Line, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { GridRows, GridColumns } from "@visx/grid";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AxisRight, AxisBottom } from "@visx/axis";
import { withTooltip, defaultStyles, Tooltip } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { max, extent, bisector } from "d3-array";
import { timeFormat } from "d3-time-format";

export const background = "#3b6978";
export const background2 = "#204051";
export const accentColor = "#d7099c";
export const accentColorLight = "#28D2FF";
export const axisColor = "#9388DB";
const tooltipStyles = {
  ...defaultStyles,
  background: "transparent",
  color: "#28D2FF",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const formatDate = timeFormat("%d %B %Y");

const getDate = (d) => new Date(d[0]);
const getPieValue = (d) => d[1];
const bisectDate = bisector((d) => new Date(d[0])).left;

const PlayChart = ({
  prices,
  width,
  height,
  margin = { top: 50, right: 50, bottom: 50, left: 0 },
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
  chartTimeRange,
}) => {
  if (width < 10) return null;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const today = useMemo(() => new Date(), []);
  const yesterday = useMemo(
    () => new Date(today.getTime() - 24 * 60 * 60 * 1000),
    [today]
  );
  const weekAgo = useMemo(
    () => new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    [today]
  );
  const monthAgo = useMemo(
    () => new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    [today]
  );

  const slicePricesByTime = useMemo(() => {
    switch (chartTimeRange) {
      case "1d":
        return prices.filter((d) => getDate(d) > yesterday);
      case "1w":
        return prices.filter((d) => getDate(d) > weekAgo);
      case "1m":
        return prices.filter((d) => getDate(d) > monthAgo);
    }
  }, [chartTimeRange, monthAgo, prices, weekAgo, yesterday]);

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(slicePricesByTime, getDate),
      }),
    [innerWidth, margin.left, slicePricesByTime]
  );
  const priceValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, max(slicePricesByTime, getPieValue) || 0],
        nice: true,
      }),
    [innerHeight, margin.top, slicePricesByTime]
  );

  const handleTooltip = useCallback(
    (event) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(slicePricesByTime, x0, 1);
      const d0 = slicePricesByTime[index - 1];
      const d1 = slicePricesByTime[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: priceValueScale(getPieValue(d)),
      });
    },
    [dateScale, slicePricesByTime, showTooltip, priceValueScale]
  );

  const x = (d) => dateScale(getDate(d));
  const y = (d) => priceValueScale(getPieValue(d));
  return (
    <div>
      <svg width={width} height={height}>
        <GridRows
          left={margin.left}
          scale={priceValueScale}
          width={innerWidth}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0.4}
          pointerEvents="none"
        />
        <GridColumns
          top={margin.top}
          scale={dateScale}
          height={innerHeight}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0}
          pointerEvents="none"
        />
        <AxisBottom
          top={innerHeight + margin.top}
          scale={dateScale}
          numTicks={5}
          stroke="transparent"
          tickStroke="transparent"
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 12,
            textAnchor: "middle",
          })}
        />
        <AxisRight
          top={0}
          left={innerWidth}
          scale={priceValueScale}
          numTicks={6}
          stroke="transparent"
          tickStroke="transparent"
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 12,
            textAnchor: "middle",
          })}
        />
        <LinePath
          data={slicePricesByTime}
          x={x}
          y={y}
          strokeWidth={2}
          stroke={accentColor}
          curve={curveMonotoneX}
        />
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke={accentColorLight}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={6}
              stroke={accentColorLight}
              strokeWidth={3}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <div>
          <Tooltip
            key={Math.random()}
            top={tooltipTop - 12}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            <span className="font-bold mb-2">{`$${getPieValue(
              tooltipData
            ).toFixed(2)}`}</span>
            <span className="uppercase font-">
              {formatDate(getDate(tooltipData))}
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default withTooltip(PlayChart);
