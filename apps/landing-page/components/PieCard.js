import Image from "next/image";
import { useMemo } from "react";
import { Popover } from "@headlessui/react";
import { LinearGradient } from "@visx/gradient";
import { scaleTime, scaleLinear } from "@visx/scale";
import { MarkerCircle } from "@visx/marker";
import { curveMonotoneX } from "@visx/curve";
import { LinePath, AreaClosed } from "@visx/shape";
import { min, max, extent } from "d3-array";
import piesImages from "../public/pies";
import popover from "../public/popover_icon.svg";
import Button from "./Button";

export const background = "#7A32FE";
export const background2 = "#7A32FE";
export const accentColor = "#D206A7";
export const accentColorDark = "#D206A7";

const getDate = (d) => new Date(d[0]);
const getPieValue = (d) => d[1];

const PieCard = ({
  pieData,
  height,
  width,
  margin = { top: 100, right: 0, left: 0, bottom: 0 },
}) => {
  const reducedHeight = height - 50 > 0 ? height - 50 : 0;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = reducedHeight - margin.top - margin.bottom;

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(pieData.ticks, getDate),
      }),
    [pieData.ticks, innerWidth, margin.left]
  );
  const pieValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [
          0,
          (max(pieData.ticks, getPieValue) || 0) + innerHeight / 1000,
        ],

        nice: true,
      }),
    [pieData.ticks, margin.top, innerHeight]
  );

  const tokenImage = useMemo(
    () => piesImages.find((token) => token.name === pieData.symbol),
    [pieData.symbol]
  );

  return (
    <>
      <svg width={width} height={reducedHeight} className="rounded-lg">
        <rect
          x={0}
          y={0}
          width={width}
          height={reducedHeight}
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
          data={pieData.ticks}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => pieValueScale(getPieValue(d)) ?? 0}
          yScale={pieValueScale}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
        <LinePath
          data={pieData.ticks}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => pieValueScale(getPieValue(d)) ?? 0}
          strokeWidth={3}
          markerMid="url(#marker-circle)"
          markerStart="url(#marker-circle2)"
          markerEnd="url(#marker-circle2)"
          stroke="#367BF5"
          curve={curveMonotoneX}
        />
      </svg>
      <div className="w-full">
        <div className="w-full absolute -top-6 flex flex-col h-[90%]">
          <div className="w-[50px] h-[50px] mx-auto">
            <Image
              placeholder="blur"
              src={tokenImage.image}
              className="rounded-full"
              alt={pieData.symbol}
            />
          </div>
          <h3 className="text-3xl text-white font-extrabold uppercase mt-3">
            {pieData.symbol}
          </h3>
          <h4 className="text-sm text-white uppercase">{pieData.name}</h4>
          <div className="text-2xl text-white font-extrabold mt-auto mx-auto flex">
            <span className="self-end">NAV</span>{" "}
            <Popover className="relative">
              <Popover.Button className="self-start ml-1">
                <Image placeholder="blur" src={popover} alt="popover" />
              </Popover.Button>
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 bottom-full sm:px-0 lg:max-w-xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-white p-7">
                    <p className="text-sm text-black">
                      The net asset value (NAV) of a Pie represents the market
                      value of each share’s portion of the Pie’s underlying
                      assets. The NAV is determined by adding up the value of
                      all assets in the Pie and then dividing that value by the
                      number of outstanding shares in the Pie.
                    </p>
                  </div>
                </div>
              </Popover.Panel>
            </Popover>
            <span className="text-4xl ml-4">${pieData.nav.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-x-4 mt-4 uppercase">
        <Button
          className="w-full"
          href={`https://www.piedao.org/#/pie/${pieData.address}`}
          target="_blank"
          rel="noreferrer noopener"
          inverted
        >
          Discover
        </Button>
        <Button
          className="w-full uppercase"
          href={`https://www.piedao.org/#/swap`}
          target="_blank"
          rel="noreferrer noopener"
        >
          BUY
        </Button>
      </div>
    </>
  );
};

export default PieCard;
