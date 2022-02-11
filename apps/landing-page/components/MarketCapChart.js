import { useMemo, useRef, useState } from "react";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { timeFormat } from "d3-time-format";
import { max } from "d3-array";

const barColor = "#412D87";
const barColorHighlight = "#d7099c";

const getMcapValue = (d) => d[1];
const getDate = (d) => new Date(d[0]);
const formatDate = timeFormat("%d/%m/%Y");

const MarketCapChart = ({
  width,
  height,
  marketcapData,
  setMcapPrice,
  setMcapDate,
}) => {
  const svgRef = useRef();
  const [activeElement, setActiveElement] = useState(null);

  const today = useMemo(() => new Date(), []);
  const weekAgo = useMemo(
    () => new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    [today]
  );

  const chartData = useMemo(() => {
    return marketcapData.filter((d) => getDate(d) > weekAgo);
  }, [marketcapData, weekAgo]);

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, width],
        domain: chartData.map(getDate),
        padding: 0.2,
      }),
    [width, chartData]
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [height, 0],
        domain: [0, max(chartData, getMcapValue)],
        nice: true,
      }),
    [height, chartData]
  );

  const handleMouseMove = (e, d) => {
    if (!svgRef.current) return;
    setActiveElement(Number(e.target.getAttribute("x")));
    setMcapPrice(getMcapValue(d));
    setMcapDate(formatDate(getDate(d)));
  };

  if (width < 10) return null;

  return (
    <div>
      <svg width={width} height={height} ref={svgRef}>
        <Group top={0}>
          {chartData.map((d) => {
            const date = getDate(d);
            const barWidth = xScale.bandwidth();
            const barHeight = height - (yScale(getMcapValue(d)) ?? 0);
            const barX = xScale(date);
            const barY = height - barHeight;
            return (
              <Bar
                key={`bar-${Math.random()}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={activeElement === barX ? barColorHighlight : barColor}
                rx={2}
                onMouseMove={(e) => handleMouseMove(e, d)}
                onTouchMove={(e) => handleMouseMove(e, d)}
              />
            );
          })}
        </Group>
      </svg>
    </div>
  );
};

export default MarketCapChart;
