// import { Logo } from "@piedao/ui-components";
import Image from "next/image";
import Button from "./Button";
import PriceChange from "./PriceChange";
import ShareMenu from "./ShareMenu";
import playLogo from "../public/play_logo.svg";
import arrowIconGreen from "../public/arrow_icon_green.svg";
import arrowIconRed from "../public/arrow_icon_red.svg";
import piedaoLogo from "../public/piedao_logo_text.png";
import styles from "../styles/PlayBar.module.scss";

const PlayBar = ({ play }) => {
  const { usd_24h_change, usd } = play;

  return (
    <div
      className={`xl:container flex w-full sticky top-2 z-40 h-[65px] mx-4 items-center py-4 px-2 md:p-4 xl:rounded-md border-transparent border-x-0 border-y-4 xl:border-4 ${styles.gradient}`}
    >
      <div className="w-auto flex items-center">
        <div className="mr-6 hidden lg:flex">
          <Image src={piedaoLogo} alt="PieDao Logo" />
        </div>
        <Image src={playLogo} alt="play logo" />
        <div className="ml-2 align-baseline">
          <p className="text-gradient text-2xl md:text-xl leading-none md:leading-none flex">
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
        <p className="text-white text-2xl mr-2 md:mr-4">$ {usd}</p>
        <Button className="md:mr-4 px-8" href="#">
          BUY
        </Button>
        <ShareMenu />
      </div>
    </div>
  );
};

export default PlayBar;
