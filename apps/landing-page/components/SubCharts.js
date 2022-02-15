import { useMemo, useState } from "react";
import Image from "next/image";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import priceFormatter from "../utils/priceFormatter";
import timeFormat from "../utils/timeFormat";
import MarketCapChart from "./MarketCapChart";
import navPlaceholder from "../public/nav_placeholder.svg";
import arrowRed from "../public/arrow_red.svg";
import arrowGreen from "../public/arrow_green.svg";
import SentimentCheck from "./SentimentCheck";
import content from "../content/en_EN.json";

const getDate = (d) => timeFormat(new Date(d[0]));

const SubCharts = ({ nav, pie }) => {
  const latestTickDate = getDate(
    pie.ticks.market_caps[pie.ticks.market_caps.length - 1]
  );

  const inceptionPerc = useMemo(() => {
    return ((pie.usd - 1) * 100).toFixed();
  }, [pie.usd]);

  const [mcapPrice, setMcapPrice] = useState(pie.usd_market_cap.toFixed(2));
  const [mcapDate, setMcapDate] = useState(latestTickDate);

  return (
    <section className="mb-10 gap-y-4 md:gap-4 grid auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col">
        <h4 className="font-bold text-white mb-2">{content.subcharts.nav}</h4>
        <div className="w-full flex flex-1 flex-col border border-deeper_purple rounded-lg py-2 px-4">
          <div className="w-full flex flex-wrap justify-between items-center">
            <p className="text-gradient text-2xl">
              {priceFormatter.format(nav)}
            </p>
            <p className="text-sm text-deep_purple">{timeFormat(Date.now())}</p>
          </div>
          <div className="flex flex-1 items-center">
            <Image src={navPlaceholder} alt="nav placeholder" />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:col-span-2 order-none md:order-last lg:order-none">
        <h4 className="font-bold text-white mb-2">
          {content.subcharts.marketcap}
        </h4>
        <div className="flex flex-col flex-1 border border-deeper_purple rounded-lg py-2 px-4">
          <div className="flex flex-wrap justify-between items-center">
            <p className="flex text-gradient text-2xl">
              {priceFormatter.format(mcapPrice)}
            </p>
            <p className="flex text-sm text-deep_purple">{mcapDate}</p>
          </div>
          <div className="w-full flex flex-col flex-1 mb-2">
            <ParentSize>
              {({ width, height }) => (
                <MarketCapChart
                  width={width}
                  height={height}
                  setMcapPrice={setMcapPrice}
                  setMcapDate={setMcapDate}
                  marketcapData={pie.ticks.market_caps}
                />
              )}
            </ParentSize>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="font-bold text-white mb-2">
          {content.subcharts.inception}
        </h4>
        <div className="h-24 flex border border-deeper_purple rounded-lg p-4 justify-center items-center mb-4">
          <p className="text-gradient text-4xl mr-3">+ {inceptionPerc}%</p>
          <Image src={inceptionPerc >= 0 ? arrowGreen : arrowRed} alt="Arrow" />
        </div>
        <h4 className="font-bold text-white mb-2">
          {content.subcharts.sentiment.title}
        </h4>
        <SentimentCheck />
      </div>
    </section>
  );
};

export default SubCharts;
