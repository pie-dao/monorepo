// import { Logo } from "@piedao/ui-components";
import Image from "next/image";
import Button from "./Button";
import PriceChange from "./PriceChange";
import ShareMenu from "./ShareMenu";
import playLogo from "../public/play_logo.svg";
import piedaoLogo from "../public/piedao_logo_text.png";
import styles from "../styles/PlayBar.module.scss";

const PlayBar = ({ play }) => {
  const { usd_24h_change, usd } = play;

  return (
    <div
      className={`xl:container flex w-full sticky top-4 z-40 h-[65px] mx-4 items-center py-4 px-6 md:p-6 xl:rounded-md border-transparent border-x-0 border-y-2 xl:border-2 ${styles.gradient}`}
    >
      <div className="w-auto flex items-center">
        <div className="mr-6 hidden lg:flex">
          <a
            href="https://www.piedao.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex"
          >
            <Image src={piedaoLogo} alt="PieDao Logo" />
          </a>
        </div>
        <Image src={playLogo} alt="play logo" />
        <div className="ml-2 align-baseline">
          <p className="text-gradient text-xl md:text-xl leading-none md:leading-none flex">
            PLAY{" "}
            <span className="text-white text-sm hidden md:block ml-2">
              <PriceChange priceChangeUsd={usd_24h_change} />
            </span>
          </p>
          <p className="text-white text-[0.75rem] uppercase leading-none md:leading-none hidden md:block">
            Metaverse NFT index
          </p>
        </div>
      </div>
      <div className="flex w-auto ml-auto items-center">
        <p className="text-white text-xl md:text-2xl mr-2 md:mr-4">$ {usd}</p>
        <Button
          className="md:mr-4 px-8"
          href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"
          target="_blank"
          rel="noopener noreferrer"
        >
          BUY
        </Button>
        <ShareMenu />
      </div>
    </div>
  );
};

export default PlayBar;