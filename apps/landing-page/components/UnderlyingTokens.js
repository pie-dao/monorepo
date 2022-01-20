import Image from "next/image";
import content from "../content/en_EN.json";
import pies from "../config/pies.json";

const ScrollingBoxes = ({ }) => {
  let play = pies["0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"];
  console.log("play", play);

  return (
    <section className={`w-full justify-evenly content-center text-center relative`}>
      <img className="z-30 absolute -top-3" src="./bg_front_line_1.svg" />
      <img className="z-50 absolute -top-3" src="./bg_front_line_2.svg" />
      <img className="z-50 absolute w-24 ml-[48%] mt-20 shadow-xl" src="./logo_play.svg" />
      <div className="bg-secondary absolute p-8 z-40 w-full">
        <p className="z-50 uppercase text-4xl">
          underlying <span className="font-bold">tokens</span>
        </p>
      </div>

      <div className="flex m-10 mt-60">
        {play.composition.map(pie => {
          return (
            <div className="relative w-1/3 p-4 m-1 rounded-md bg-secondary flex flex-col items-center justify-center text-center">
              <img className="absolute -top-6 left-3" src={`/assets/${pie.icon}`} />
              <p className="text-xl p-2 text-bold pt-8">{pie.symbol}</p>
            </div>
          )
        })}
      </div>
    </section>
  );
};

export default ScrollingBoxes;
