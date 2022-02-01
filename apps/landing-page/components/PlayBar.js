import { Logo } from "@piedao/ui-components";
import Image from "next/image";
import Button from "./Button";
import playLogo from "../public/play_logo.svg";
import shareIcon from "../public/share.svg";
import styles from "../styles/PlayBar.module.scss";

const PlayBar = ({ props }) => {
  return (
    <div
      className={`xl:container flex w-full sticky top-0 z-50 h-[65px] items-center p-4 xl:rounded-md border-transparent border-x-0 border-y-4 xl:border-4 ${styles.gradient}`}
    >
      <div className="w-auto flex items-center">
        <div className="mr-6 hidden md:block">
          <Logo size="large" />
        </div>
        <Image src={playLogo} alt="play logo" />
        <div className="ml-2 align-baseline">
          <p className="text-gradient text-2xl md:text-xl leading-none md:leading-none flex">
            PLAY{" "}
            <span className="text-white text-sm hidden md:block ml-2">
              +2.42
            </span>
          </p>
          <p className="text-white text-[0.75rem] uppercase leading-none md:leading-none hidden md:block">
            Metaverse NFT index
          </p>
        </div>
      </div>
      <div className="flex w-auto ml-auto items-center">
        <p className="text-white text-2xl mr-4">$ 3,32</p>
        <Button className="mr-4">BUY</Button>
        <Image src={shareIcon} alt="share icon" />
      </div>
    </div>
  );
};

export default PlayBar;
