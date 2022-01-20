import Image from "next/image";
import content from "../content/en_EN.json";

const Roi = ({ }) => {
  return (
    <section className={`w-full pt-10`}>
      <div className="bg-secondary relative grid content-around justify-center p-8 w-full h-96">
        <img className="z-20 absolute -top-10" src="./bg_big_line_2.svg" />
        <img className="z-40 absolute -top-16" src="./bg_big_line_1.svg" />        
        <div className="bg-highlight z-50 relative -top-10 uppercase text-xl p-4 rounded-xl flex flex-col items-center justify-center">
          <p className="font-light">If you had bought PLAY in March 2021</p>
          <p className="font-bold">you would have an ROI of 255%</p>
        </div>
        <div className="bg-black z-50 relative uppercase text-xl p-4 rounded-xl flex flex-col items-center justify-center">
          <div className="w-full flex mb-4">
            <div className="w-1/4 flex flex-col items-center text-center justify-center">
              <p>100$</p>
              <p className="font-light text-sm">01/03/2021</p>
            </div>
            <div className="w-3/4">
            <img src="/roi_placeholder.svg" />             
            </div>
            <div className="w-1/4 flex flex-col items-center text-center justify-center">
              <p>250$</p>
              <p className="font-light text-sm">Today</p>
            </div>
          </div>
        </div>
        <div className="pt-4 relative z-50 flex flex-col items-center text-center justify-center">
          <p className="font-bold">With 550+ token holders</p>
          <p>PLAY is our fastest-growing PIE</p>
        </div>     
        <div className="relative top-6 z-50 flex flex-col items-center text-center justify-center">
          <button className="pl-1 pr-1 pt-4 pb-4 rounded-md bg-gradient-to-tr from-red-500 to-blue-500">
            <span className="rounded-md bg-[#201140] p-4">Buy Play</span>
          </button>
        </div>          
      </div>
    </section>
  );
};

export default Roi;
