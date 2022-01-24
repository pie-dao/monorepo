import Image from "next/image";
import content from "../content/en_EN.json";
import pies from "../config/pies.json";

const ScrollingBoxes = ({ }) => {
  let play = pies["0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"];

  return (
    <section className={`w-full justify-evenly content-center text-center relative`}>
      <img className="z-20 absolute -top-3 hidden md:block" src="./bg_front_line_1.svg" />
      <img className="z-40 absolute -top-3 hidden md:block" src="./bg_front_line_2.svg" />
      <img className="z-20 absolute -top-3 md:hidden block" src="./bg_front_line_1_mobile.svg" />
      <img className="z-40 absolute -top-3 md:hidden block" src="./bg_front_line_2_mobile.svg" />      
      {/* <img className="z-50 absolute w-24 ml-[48%] mt-20 shadow-sm" src="./logo_play.svg" /> */}
      <div className="bg-secondary absolute p-8 z-30 w-full">
        <p className="z-50 uppercase text-xl md:text-4xl">
          underlying <span className="font-bold">tokens</span>
        </p>
      </div>

      <div class="relative rounded-xl overflow-auto">
      <div class="mt-40 overflow-x-scroll flex">
        {play.composition.map(pie => {
          return (           
            <div key={pie.address} className="relative w-1/3 p-4 m-1 rounded-md bg-secondary flex flex-col items-center justify-center text-left">
              <img className="absolute -top-6 left-3" src={`/assets/${pie.icon}`} />
              <div class="w-full">
                <p className="w-full text-sm pt-8 pb-6">23%</p>
                <p className="text-xl text-bold">{pie.symbol}</p>
                <p className="text-xl text-extrabold text-highlight">3.45$</p>
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </section>
  );
};

export default ScrollingBoxes;
