import { useMemo, useState } from "react";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import priceFormatter from "../utils/priceFormatter";
import MarketCapChart from "./MarketCapChart";
import { timeFormat } from "d3-time-format";

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
    <section className="container mx-auto px-4 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <h4 className="font-bold text-white">NAV</h4>
        <div className="flex flex-col border border-deeper_purple rounded-lg py-2 px-4">
          <p className="text-gradient text-2xl">{priceFormatter.format(nav)}</p>
          <p className="text-sm text-deep_purple"></p>
        </div>
      </div>
      <div className="col-span-2">
        <h4 className="font-bold text-white">Marketcap</h4>
        <div className="flex flex-col mb-4 border border-deeper_purple rounded-lg py-2 px-4">
          <div className="flex justify-between items-center">
            <p className="flex text-gradient text-2xl">
              {priceFormatter.format(mcapPrice)}
            </p>
            <p className="flex text-sm text-deep_purple">{mcapDate}</p>
          </div>
          <div className="w-full flex flex-col h-[200px] mb-6">
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
      <div>
        <h4 className="font-bold text-white">Incpetion: 21/02/2021</h4>
        <div className="flex flex-col border border-deeper_purple rounded-lg py-2 px-4 text-center">
          <p className="text-gradient text-4xl">+{inceptionPerc}%</p>
        </div>
        <h4 className="font-bold text-white">How do you feel about play?</h4>
        <div className="flex flex-col border border-deeper_purple rounded-lg py-2 px-4"></div>
      </div>
    </section>
  );
};

export default SubCharts;
