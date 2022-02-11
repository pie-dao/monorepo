import Button from "./Button";
import Image from "next/image";
import sushiswapLogo from "../public/sushiswap_logo.png";
import oneInch from "../public/1inch.svg";
import uniswap from "../public/uniswap.svg";
import roiPlaceholder from "../public/roi_placeholder.svg";

const Roi = ({}) => {
  return (
    <section className={`w-full my-10`}>
      <div className="bg-secondary relative grid content-around justify-center my-24 w-full">
        {/* <img className="z-20 absolute -top-10" src="./bg_big_line_2.svg" />
        <img className="z-40 absolute -top-16" src="./bg_big_line_1.svg" /> */}
        <div className="container mx-auto px-6">
          <div className="bg-highlight z-20 relative -top-16 sm:-top-12 text-2xl p-4 mx-4 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="font-light">If you had bought PLAY in June 2021</p>
            <p className="font-bold">you would have an ROI of 629%</p>
          </div>
          <div className="bg-black z-20 relative uppercase text-xl p-4 md:rounded-xl flex flex-col items-center justify-center">
            <div className="w-full flex mb-4 flex-col md:flex-row">
              <div className="w-full md:w-1/4 flex flex-col items-center text-center justify-center">
                <p className="text-gradient">$100</p>
                <p className="font-light text-sm text-[#9388DB]">01-06-2021</p>
              </div>
              <div className="w-full md:w-3/4">
                <Image src={roiPlaceholder} alt="ROI Placeholder" />
              </div>
              <div className="w-full md:w-1/4 flex flex-col items-center text-center justify-center">
                <p className="text-gradient">$729</p>
                <p className="font-light text-sm text-[#9388DB]">31-12-2021</p>
              </div>
            </div>
          </div>
          <div className="pt-4 relative z-20 flex flex-col items-center text-center justify-center">
            <p className="font-bold text-sm md:text-xl">
              With 550+ token holders
            </p>
            <p className="text-sm md:text-xl">
              PLAY is our fastest-growing PIE
            </p>
          </div>
          <div className="relative top-6 z-20 flex flex-col items-center text-center justify-center">
            <Button
              href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase flex items-center px-8 button gradient"
            >
              <>
                <span className="font-bold mr-2">Buy on SushiSwap</span>
                <Image src={sushiswapLogo} alt="sushiswap logo" />
              </>
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6">
        <p className="text-center uppercase text-sm text-[#9388DB] mb-4">
          You can find PLAY also on
        </p>
        <div className="flex justify-center items-center gap-x-10">
          <a
            href="https://app.1inch.io/#/1/swap/ETH/0x33e18a092a93ff21ad04746c7da12e35d34dc7c4/import-token"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center"
          >
            <Image src={oneInch} alt="1inch Logo" />
            <p className="ml-2">1INCH</p>
          </a>
          <a
            href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x33e18a092a93ff21ad04746c7da12e35d34dc7c4&chain=mainnet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center"
          >
            <div>
              <Image src={uniswap} alt="uniswap Logo" />
            </div>
            <p className="ml-2">UNISWAP</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Roi;
