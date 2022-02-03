// import { Logo } from "@piedao/ui-components";
import Image from "next/image";
import Button from "./Button";
// import ShareMenu from "./ShareMenu";
import playLogo from "../public/play_logo.svg";
import arrowIconGreen from "../public/arrow_icon_green.svg";
import arrowIconRed from "../public/arrow_icon_red.svg";
import styles from "../styles/PlayBar.module.scss";

const PlayBar = ({ play }) => {
  const { usd_24h_change, usd } = play;
  const usdDayChange = usd_24h_change.toFixed(2);

  return (
    <div
      className={`xl:container flex w-full sticky top-2 z-50 h-[65px] items-center p-4 xl:rounded-md border-transparent border-x-0 border-y-4 xl:border-4 ${styles.gradient}`}
    >
      <div className="w-auto flex items-center">
        <div className="mr-6 hidden md:block">
          {/* <Logo size="large" /> */}
        </div>
        <Image src={playLogo} alt="play logo" />
        <div className="ml-2 align-baseline">
          <p className="text-gradient text-2xl md:text-xl leading-none md:leading-none flex">
            PLAY{" "}
            <span className="text-white text-sm hidden md:block ml-2">
              {usd_24h_change > 0 ? (
                <>
                  <span className="text-[#2DFF1B] mr-1">+ {usdDayChange}%</span>
                  <Image src={arrowIconGreen} alt="arrow up" />
                </>
              ) : usd_24h_change === 0 ? (
                `0%`
              ) : (
                <>
                  <span className="text-highlight mr-1">
                    - {Math.abs(usdDayChange)}%
                  </span>
                  <Image src={arrowIconRed} alt="arrow down" />
                </>
              )}
            </span>
          </p>
          <p className="text-white text-[0.75rem] uppercase leading-none md:leading-none hidden md:block">
            Metaverse NFT index
          </p>
        </div>
      </div>
      <div className="flex w-auto ml-auto items-center">
        <p className="text-white text-2xl mr-4">$ {usd}</p>
        <Button className="mr-4">BUY</Button>
        {/* <ShareMenu /> */}
      </div>
    </div>
  );
};

export default PlayBar;
