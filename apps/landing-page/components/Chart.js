import { useEffect, useState } from "react";
import Image from "next/image";
import ParentSizeModern from "@visx/responsive/lib/components/ParentSizeModern";
import usePlayTickers from "../hooks/usePlayTickers";
import SubCharts from "./SubCharts";
import auditIcon from "../public/audit.svg";
import mixBytesIcon from "../public/mixbytes.svg";
import ethIcon from "../public/ethereum.svg";
import copyIcon from "../public/copy.svg";
import metamaskIcon from "../public/metamask.svg";
import coingecko from "../public/coingecko.svg";
import coinmarketcap from "../public/coinmarketcap.svg";
import PlayChart from "./PlayChart";
import PriceChange from "./PriceChange";
import content from "../content/en_EN.json";
import Loader from "./Loader";

const getDate = (d) => new Date(d[0]);
const getPieValue = (d) => d[1];

const Chart = ({ play, sentiment }) => {
  const { playTickers, isError, isLoading } = usePlayTickers();
  const [chartTimeRange, setChartTimeRange] = useState("1m");
  const [priceDiffThreeMonthsPerc, setPriceDiffThreeMonthsPerc] = useState(0);

  useEffect(() => {
    if (playTickers) {
      const today = new Date();
      const threeMonths = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
      const lastThreeMonthsPrices = playTickers.prices?.filter(
        (d) => getDate(d) > threeMonths
      );
      const priceDiffThreeMonths =
        getPieValue(lastThreeMonthsPrices[lastThreeMonthsPrices.length - 1]) -
        getPieValue(lastThreeMonthsPrices[0]);
      setPriceDiffThreeMonthsPerc(
        (priceDiffThreeMonths / getPieValue(lastThreeMonthsPrices[0])) * 100
      );
    }
  }, [playTickers]);

  const copyOnClipboard = () => {
    navigator.clipboard.writeText(play.contract_address);
  };

  const addPlayToMetamask = async () => {
    try {
      const wasAddded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: play.contract_address,
            symbol: play.symbol,
            decimals: 18,
            image: `https://assets.coingecko.com/coins/images/14590/small/PLAY.png`,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <section className="container mx-auto my-4 px-6">
      <div className="flex flex-wrap flex-row items-center my-4 gap-2 justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <p className="hidden lg:flex font-bold">{content.chart.address}</p>
          <a
            className="flex items-center bg-secondary rounded-full pr-2"
            id="btn-ethscan"
            target="_blank"
            rel="noopener noreferrer"
            href="https://etherscan.io/token/0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"
          >
            <Image src={ethIcon} alt="Ethereum Icon" />
            <p className="text-light_blue text-xs	md:text-sm relative top-0.5 ml-1">
              {play.contract_address}
            </p>
          </a>
        </div>
        <div className="flex gap-x-4">
          <button
            onClick={copyOnClipboard}
            type="button"
            className="hidden md:flex"
          >
            <Image src={copyIcon} alt="Copy Icon" />
          </button>
          <button
            onClick={addPlayToMetamask}
            type="button"
            className="flex"
            id="btn-metamask"
          >
            <Image src={metamaskIcon} alt="Metamask Icon" />
          </button>
        </div>
        <div className="flex items-center md:ml-auto">
          <Image src={auditIcon} alt="Chart Icon" />
          <p className="ml-1 mr-2 font-bold">{content.chart.audit}</p>
          <a
            href="https://github.com/pie-dao/audits"
            target="_blank"
            className="flex"
            rel="noreferrer noopener"
          >
            <Image src={mixBytesIcon} alt="Mix Bytes Icon" />
          </a>
        </div>
      </div>
      <div className="mt-4 w-full border-t border-highlight pt-4">
        <div className="flex align-center justify-between mb-4">
          <div className="flex">
            <p className="flex font-bold items-center">
              {content.chart.fees}{" "}
              <span className="text-gradient ml-2">
                {content.chart.fees_percentage}
              </span>
            </p>
          </div>
          <div className="flex gap-x-4">
            <button
              type="button"
              className={`text-sm text-white uppercase border-2 opacity-50 border-secondary hover:border-light_blue rounded-lg px-2 py-1 leading-snug hover:opacity-100 ${
                chartTimeRange === "1d" && `border-light_blue opacity-100`
              }`}
              onClick={() => setChartTimeRange("1d")}
            >
              {content.chart.day}
            </button>
            <button
              type="button"
              className={`text-sm text-white uppercase border-2 opacity-50 border-secondary hover:border-light_blue rounded-lg px-2 py-1 leading-snug hover:opacity-100 ${
                chartTimeRange === "1w" && `border-light_blue opacity-100`
              }`}
              onClick={() => setChartTimeRange("1w")}
            >
              {content.chart.week}
            </button>
            <button
              type="button"
              className={`text-sm text-white uppercase border-2 opacity-50 border-secondary hover:border-light_blue rounded-lg px-2 py-1 leading-snug hover:opacity-100 ${
                chartTimeRange === "1m" && `border-light_blue opacity-100`
              }`}
              onClick={() => setChartTimeRange("1m")}
            >
              {content.chart.month}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-[250px] md:h-[500px]">
        {isLoading || isError ? (
          <Loader />
        ) : (
          <ParentSizeModern>
            {({ width, height }) => (
              <PlayChart
                prices={playTickers.prices}
                width={width}
                height={height}
                chartTimeRange={chartTimeRange}
              />
            )}
          </ParentSizeModern>
        )}
      </div>
      <div className="hidden md:flex text-deep_purple mb-2 gap-x-4">
        <p className="gap-x-1 flex items-center justify-center">
          {content.chart.day}{" "}
          <PriceChange
            priceChange={play.market_data.price_change_percentage_24h}
          />
        </p>
        <p className="gap-x-1 flex items-center justify-center">
          {content.chart.month}{" "}
          <PriceChange
            priceChange={play.market_data.price_change_percentage_30d}
          />
        </p>
        <p className="gap-x-1 flex items-center justify-center">
          {content.chart.three_months}{" "}
          <PriceChange priceChange={priceDiffThreeMonthsPerc} />
        </p>
      </div>
      <div className="w-full border-b border-highlight mb-10"></div>
      {isLoading || isError ? (
        <Loader />
      ) : (
        <SubCharts
          marketCap={playTickers.market_caps}
          play={play}
          playPrices={playTickers.prices}
          sentiment={sentiment}
        />
      )}
      <div className="container mx-auto px-6 mb-12">
        <p className="text-center uppercase text-sm text-deep_purple mb-4">
          {content.chart.check}
        </p>
        <div className="flex justify-center items-center gap-x-10">
          <a
            href="https://www.coingecko.com/en/coins/metaverse-nft-index"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center"
            id="coingecko"
          >
            <Image src={coingecko} alt="coingecko Logo" />
          </a>
          <a
            href="https://coinmarketcap.com/currencies/metaverse-nft-index"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center"
            id="coinmarketcap"
          >
            <div>
              <Image src={coinmarketcap} alt="coinmarketcap Logo" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Chart;
