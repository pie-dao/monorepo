/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useCallback } from "react";
import { LinePath, Line, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { scaleTime, scaleLinear } from "@visx/scale";
import { withTooltip } from "@visx/tooltip";
import { LinearGradient } from "@visx/gradient";
import { localPoint } from "@visx/event";
import { max, extent, bisector } from "d3-array";

export const background = "#3b6978";
export const background2 = "#204051";
export const accentColor = "#d7099c";
export const accentColorLight = "#28D2FF";
export const axisColor = "#9388DB";

const getDate = (d) => new Date(d[0]);
const getNavValue = (d) => d[1];
const getNavDiffPrice = (d) => d[2];
const bisectDate = bisector((d) => new Date(d[0])).left;

const NavChart = ({
  lastWeekMeanNavData,
  width,
  height,
  margin = { top: 30, right: 0, bottom: 0, left: 0 },
  showTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
  setNavDate,
  setNavPrice,
  setNavDiffPrice,
}) => {
  if (width < 10) return null;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(lastWeekMeanNavData, getDate),
      }),
    [innerWidth, margin.left, lastWeekMeanNavData]
  );
  const navValueScale = useMemo(
    () =>
      scaleLinear({
        range: [(innerHeight + margin.top) * 2, margin.top],
        domain: [0, max(lastWeekMeanNavData, getNavValue) || 0],
        nice: true,
      }),
    [innerHeight, margin.top, lastWeekMeanNavData]
  );

  const handleTooltip = useCallback(
    (event) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(lastWeekMeanNavData, x0, 1);
      const d0 = lastWeekMeanNavData[index - 1];
      const d1 = lastWeekMeanNavData[index];
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
        tooltipTop: navValueScale(getNavValue(d)),
      });
      setNavPrice(getNavValue(d));
      setNavDate(getDate(d));
      setNavDiffPrice(getNavDiffPrice(d));
    },
    [
      dateScale,
      lastWeekMeanNavData,
      showTooltip,
      navValueScale,
      setNavPrice,
      setNavDate,
      setNavDiffPrice,
    ]
  );

  const x = (d) => dateScale(getDate(d));
  const y = (d) => navValueScale(getNavValue(d));
  return (
    <div>
      <svg width={width} height={height}>
        <LinearGradient
          id="patatina"
          from={accentColor}
          to={accentColorLight}
        />

        <LinePath
          data={lastWeekMeanNavData}
          x={x}
          y={y}
          strokeWidth={2}
          stroke={`url(#patatina)`}
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
        />
        {tooltipData && (
          <g>
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
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke={accentColor}
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default withTooltip(NavChart);
