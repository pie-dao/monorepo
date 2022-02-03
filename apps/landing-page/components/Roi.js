import Button from "./Button";
import Image from "next/image";
import sushiswapLogo from "../public/sushiswap_logo.png";
import roiPlaceholder from "../public/roi_placeholder.svg";
import content from "../content/en_EN.json";

const Roi = ({}) => {
  return (
    <section className={`w-full pt-10`}>
      <div className="bg-secondary relative grid content-around justify-center my-24 w-full">
        {/* <img className="z-20 absolute -top-10" src="./bg_big_line_2.svg" />
        <img className="z-40 absolute -top-16" src="./bg_big_line_1.svg" /> */}
        <div className="bg-highlight z-20 relative -top-16 sm:-top-12 text-2xl p-4 mx-4 rounded-xl flex flex-col items-center justify-center text-center">
          <p className="font-light">If you had bought PLAY in March 2021</p>
          <p className="font-bold">you would have an ROI of 255%</p>
        </div>
        <div className="bg-black z-20 relative uppercase text-xl p-4 md:rounded-xl flex flex-col items-center justify-center">
          <div className="w-full flex mb-4 flex-col md:flex-row">
            <div className="w-full md:w-1/4 flex flex-col items-center text-center justify-center">
              <p className="text-gradient">100$</p>
              <p className="font-light text-sm text-[#9388DB]">01-03-2021</p>
            </div>
            <div className="w-full md:w-3/4">
              <Image src={roiPlaceholder} alt="ROI Placeholder" />
            </div>
            <div className="w-full md:w-1/4 flex flex-col items-center text-center justify-center">
              <p className="text-gradient">254$</p>
              <p className="font-light text-sm text-[#9388DB]">01-04-2021</p>
            </div>
          </div>
        </div>
        <div className="pt-4 relative z-20 flex flex-col items-center text-center justify-center">
          <p className="font-bold">With 550+ token holders</p>
          <p>PLAY is our fastest-growing PIE</p>
        </div>
        <div className="relative top-6 z-20 flex flex-col items-center text-center justify-center">
          <Button className="uppercase btn-lg flex items-center" gradient large>
            <span className="font-bold mr-2">Buy on SushiSwap</span>
            <Image src={sushiswapLogo} alt="sushiswap logo" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Roi;
