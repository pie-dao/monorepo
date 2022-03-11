import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Popover } from "@headlessui/react";
import Loader from "./Loader";
import useUnderlyingData from "../hooks/useUnderlyingData";
import popover from "../public/popover_icon.svg";
import priceFormatter from "../utils/priceFormatter";
import timeFormat from "../utils/timeFormat";
import MarketCapChart from "./MarketCapChart";
import NavChart from "./NavChart";
import arrowRed from "../public/arrow_red.svg";
import arrowGreen from "../public/arrow_green.svg";
import inceptionFire from "../public/inception_fire.png";
import sentimentHeart from "../public/sentiment_heart.png";
import SentimentCheck from "./SentimentCheck";
import { mean } from "d3-array";
import content from "../content/en_EN.json";

const getDate = (d) => new Date(d[0]);
const getNavDate = (d) => d.timestamp;
const getPieValue = (d) => d[1];

const SubCharts = ({ marketCap, play, sentiment }) => {
  const [mcapPrice, setMcapPrice] = useState(null);
  const [mcapDate, setMcapDate] = useState(null);
  const [navPrice, setNavPrice] = useState(null);
  const [navDate, setNavDate] = useState(null);
  const [lastWeekMCap, setLastWeekMCap] = useState(null);
  const [lastWeekMeanNav, setLastWeekMeanNav] = useState(null);
  const [premiumPerc, setPremiumPerc] = useState(0);

  const { underlyingData, isLoading, isError } = useUnderlyingData();

  const weekAgo = useMemo(
    () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    []
  );
  const inceptionPerc = () => (play.market_data.current_price.usd - 1) * 100;

  const marketCapMeanLastWeek = useCallback(() => {
    const lastWeek = marketCap.filter((d) => getDate(d) >= weekAgo);
    let lastWeekPerDay = [];
    let todayCounter = Date.now();
    for (let i = 0; i < 7; i++) {
      const days = lastWeek.filter(
        (d) =>
          getDate(d) <= todayCounter &&
          getDate(d) >= todayCounter - 24 * 60 * 60 * 1000
      );
      const meanPrice = mean(days.map((d) => getPieValue(d)));
      const dayMean = [todayCounter, meanPrice];
      lastWeekPerDay.push(dayMean);
      todayCounter -= 24 * 60 * 60 * 1000;
    }

    return lastWeekPerDay.reverse();
  }, [marketCap, weekAgo]);

  const lastWeekMeanNavCalc = useCallback(
    (history) => {
      const lastWeek = history.filter((d) => getNavDate(d) >= weekAgo);
      let lastWeekPerDay = [];
      let todayCounter = Date.now();
      for (let i = 0; i < 7; i++) {
        const days = lastWeek.filter(
          (d) =>
            getNavDate(d) <= todayCounter &&
            getNavDate(d) >= todayCounter - 24 * 60 * 60 * 1000
        );
        const meanPrice = mean(days.map((d) => d.nav));
        const dayMean = [todayCounter, meanPrice];
        lastWeekPerDay.push(dayMean);
        todayCounter -= 24 * 60 * 60 * 1000;
      }
      return lastWeekPerDay.reverse();
    },
    [weekAgo]
  );

  useEffect(() => {
    if (underlyingData) {
      setPremiumPerc(
        ((play.market_data.current_price.usd - underlyingData.history[0].nav) /
          play.market_data.current_price.usd) *
          100
      );
    }
  }, [play.market_data.current_price.usd, underlyingData]);

  useEffect(() => {
    if (underlyingData) {
      const lastWeek = marketCapMeanLastWeek();
      const lastWeekMeanNav = lastWeekMeanNavCalc(underlyingData.history);
      setLastWeekMCap(lastWeek);
      setLastWeekMeanNav(lastWeekMeanNav);
    }
  }, [lastWeekMeanNavCalc, marketCapMeanLastWeek, underlyingData]);

  useEffect(() => {
    if (underlyingData && lastWeekMCap && lastWeekMeanNav) {
      setMcapPrice(getPieValue(lastWeekMCap[lastWeekMCap.length - 1]));
      setMcapDate(timeFormat(getDate(lastWeekMCap[lastWeekMCap.length - 1])));
      setNavPrice(getPieValue(lastWeekMeanNav[lastWeekMeanNav.length - 1]));
      setNavDate(getDate(lastWeekMeanNav[lastWeekMeanNav.length - 1]));
    }
  }, [lastWeekMCap, lastWeekMeanNav, underlyingData]);

  return (
    <section className="mb-10 gap-y-4 md:gap-4 grid auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col">
        <Popover className="relative">
          <Popover.Button className="mb-2">
            <div className="flex items-center">
              <h4 className="font-bold text-white mr-1">
                {content.subcharts.nav}
              </h4>
              <Image src={popover} alt="popover" />
            </div>
          </Popover.Button>
          <Popover.Panel className="absolute z-10 w-screen max-w-[19rem] mt-3 -translate-x-[42%] left-[50%]">
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="relative bg-white p-4">
                <p className="text-sm text-black font-bold">
                  {content.explore_products.nav.tooltip}
                </p>
              </div>
            </div>
          </Popover.Panel>
        </Popover>
        <div className="w-full flex flex-1 flex-col border border-deeper_purple rounded-lg py-2 px-4">
          {isLoading || isError || !lastWeekMeanNav ? (
            <Loader />
          ) : (
            <>
              <div className="w-full flex flex-wrap justify-between items-center">
                <p className="text-gradient text-2xl">
                  {priceFormatter.format(navPrice)}
                </p>
                <p className="text-sm text-deep_purple">
                  {timeFormat(navDate)}
                </p>
              </div>
              <div className="w-full flex">
                <p>
                  {premiumPerc > 0 ? (
                    <>
                      <span className="uppercase text-highlight">
                        {content.subcharts.premium}
                      </span>{" "}
                      <span className="uppercase text-highlight font-bold">
                        {premiumPerc.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="uppercase text-highlight">
                        {content.subcharts.discount}
                      </span>{" "}
                      <span className="uppercase text-highlight font-bold">
                        {Math.abs(premiumPerc).toFixed(2)}%
                      </span>
                    </>
                  )}
                </p>
              </div>
              <div className="w-full flex flex-col flex-1 mb-2">
                <ParentSize>
                  {({ width, height }) => (
                    <NavChart
                      width={width}
                      height={height}
                      lastWeekMeanNavData={lastWeekMeanNav}
                      setNavPrice={setNavPrice}
                      setNavDate={setNavDate}
                    />
                  )}
                </ParentSize>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="font-bold text-white mb-2">
          {content.subcharts.marketcap}
        </h4>
        <div className="flex flex-col flex-1 border border-deeper_purple rounded-lg py-2 px-4">
          {isLoading || isError || !lastWeekMeanNav ? (
            <Loader />
          ) : (
            <>
              <div className="flex flex-wrap justify-between items-center mb-2">
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
                      marketcapData={lastWeekMCap}
                    />
                  )}
                </ParentSize>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-1 md:flex-row lg:flex-col gap-4">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2 mb-2 flex-row">
            <Image src={inceptionFire} alt="inception" />
            <h4 className="font-bold text-white">
              {content.subcharts.inception}
            </h4>
          </div>
          <div className="flex-1 md:flex-none lg:flex-1 md:h-[102px] lg:h-auto flex border border-deeper_purple rounded-lg p-4 justify-center items-center lg:mb-4">
            <p className="text-gradient text-4xl mr-3">
              + {inceptionPerc().toFixed()}%
            </p>
            <Image
              src={inceptionPerc() >= 0 ? arrowGreen : arrowRed}
              alt="Arrow"
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2 mb-2">
            <Image src={sentimentHeart} alt="inception" />
            <h4 className="font-bold text-white">
              {content.subcharts.sentiment.title}
            </h4>
          </div>
          <SentimentCheck {...sentiment} />
        </div>
      </div>
    </section>
  );
};

export default SubCharts;
