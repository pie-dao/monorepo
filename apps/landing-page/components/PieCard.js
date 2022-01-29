import { useMemo } from "react";
import { LinearGradient } from "@visx/gradient";
import { scaleTime, scaleLinear } from "@visx/scale";
import { MarkerCircle } from "@visx/marker";
import { curveNatural } from "@visx/curve";
import { LinePath, AreaClosed } from "@visx/shape";
import { min, max, extent } from "d3-array";

export const background = "#7A32FE";
export const background2 = "#7A32FE";
export const accentColor = "#D206A7";
export const accentColorDark = "#D206A7";

const PieCard = ({ pie, height, width }) => {
  const { prices } = pie;
  const getDate = (d) => new Date(d[0]);
  const getPieValue = (d) => d[1];
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, width],
        domain: extent(prices, getDate),
      }),
    [prices, width]
  );
  const pieValueScale = useMemo(
    () =>
      scaleLinear({
        range: [height, 0],
        domain: [min(prices, getPieValue), max(prices, getPieValue)],
        nice: true,
      }),
    [prices, height]
  );

  return (
    <>
      <div className="rounded-md overflow-hidden">
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
          />
          <LinearGradient
            id="area-background-gradient"
            from={background}
            to={background2}
          />
          <LinearGradient
            id="area-gradient"
            from={accentColor}
            to={accentColor}
            toOpacity={1}
          />
          <MarkerCircle
            id="marker-circle"
            fill="#fff"
            stroke="#367BF5"
            size={2}
            refX={2}
          />
          <MarkerCircle
            id="marker-circle2"
            fill="#fff"
            stroke="#367BF5"
            size={0}
            refX={2}
          />
          <AreaClosed
            data={prices}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => pieValueScale(getPieValue(d)) ?? 0}
            yScale={pieValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveNatural}
          />
          <LinePath
            data={prices}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => pieValueScale(getPieValue(d)) ?? 0}
            strokeWidth={3}
            markerMid="url(#marker-circle)"
            markerStart="url(#marker-circle2)"
            markerEnd="url(#marker-circle2)"
            stroke="#367BF5"
            curve={curveNatural}
          />
        </svg>
      </div>
      <div className="w-full mb-4">
        <div className="w-[50px] h-[50px] mx-auto">
          <img
            src={pie.image.small}
            className="w-full rounded-full"
            alt={pie.name}
          />
        </div>
        <div className="w-full">
          <h3 className="text-xl text-highlight uppercase">{pie.symbol}</h3>
          <h4 className="text-sm text-highlight uppercase">{pie.name}</h4>
          <p>{pie.usd_24h_change?.toFixed(2)}</p>
          <p className="text-sm text-highlight">${pie.usd.toFixed(2)}</p>
        </div>
      </div>
    </>
  );
};

export default PieCard;
