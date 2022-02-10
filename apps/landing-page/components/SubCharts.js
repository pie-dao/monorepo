import { useMemo, useState } from "react";
import Image from "next/image";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { timeFormat } from "d3-time-format";
import priceFormatter from "../utils/priceFormatter";
import MarketCapChart from "./MarketCapChart";
import navPlaceholder from "../public/nav_placeholder.svg";
import arrowRed from "../public/arrow_red.svg";
import arrowGreen from "../public/arrow_green.svg";
import SentimentCheck from "./SentimentCheck";

const formatDate = timeFormat("%d/%m/%Y");
const getDate = (d) => formatDate(new Date(d[0]));

const SubCharts = ({ play }) => {
  const playData = play.history[0];
  const { nav, pie } = playData;

  const latestTickDate = getDate(
    pie.ticks.market_caps[pie.ticks.market_caps.length - 1]
  );

  const inceptionPerc = useMemo(() => {
    return ((pie.usd - 1) * 100).toFixed();
  }, [pie.usd]);

  const [mcapPrice, setMcapPrice] = useState(pie.usd_market_cap.toFixed(2));
  const [mcapDate, setMcapDate] = useState(latestTickDate);

  return (
    <section className="container mx-auto mb-10 px-4 gap-y-4 md:gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col">
        <h4 className="font-bold text-white mb-2">NAV</h4>
        <div className="w-full flex flex-1 flex-col border border-deeper_purple rounded-lg py-2 px-4">
          <div className="w-full flex flex-wrap justify-between items-center">
            <p className="text-gradient text-2xl">
              {priceFormatter.format(nav)}
            </p>
            <p className="text-sm text-deep_purple">{formatDate(Date.now())}</p>
          </div>
          <div className="flex flex-1 items-center">
            <Image src={navPlaceholder} alt="nav placeholder" />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="font-bold text-white mb-2">Marketcap</h4>
        <div className="flex flex-col border border-deeper_purple rounded-lg py-2 px-4">
          <div className="flex flex-wrap justify-between items-center">
            <p className="flex text-gradient text-2xl">
              {priceFormatter.format(mcapPrice)}
            </p>
            <p className="flex text-sm text-deep_purple">{mcapDate}</p>
          </div>
          <div className="w-full flex flex-col h-[130px] mb-2">
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
        <h4 className="font-bold text-white mb-2">Incpetion: 21/02/2021</h4>
        <div className="flex border border-deeper_purple rounded-lg p-4 justify-center items-center mb-4">
          <p className="text-gradient text-4xl mr-3">+ {inceptionPerc}%</p>
          <Image src={inceptionPerc >= 0 ? arrowGreen : arrowRed} alt="Arrow" />
        </div>
        <h4 className="font-bold text-white mb-2">
          How do you feel about play?
        </h4>
        {/* <SentimentCheck /> */}
      </div>
    </section>
  );
};

export default SubCharts;
