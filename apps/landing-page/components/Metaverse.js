import Image from "next/image";
import content from "../content/en_EN.json";

const Metaverse = ({}) => {
  return (
    <section classNameName={`bg-primary w-full justify-evenly content-center text-center flex flex-row md:flex-col`}>
      <div className="flex mb-4 ml-12 mr-12">
        <div className="w-1/2 p-10 pt-[5pc]">
          <h1 className="text-4xl text-highlight uppercase">What <span className="font-bold">is the metaverse?</span></h1>
          <h2>{content.metaverse.description}</h2>
          <div className="flex mb-4 mt-4">
            <div className="grid content-around rounded-xl w-1/2 border-4 border-transparent border-l-highlight pl-4">
            {content.metaverse.details_left}
            </div>
            <div className="grid content-around rounded-xl w-1/2 border-4 border-transparent border-l-highlight pl-4">
            {content.metaverse.details_right}
            </div>
          </div>
        </div>
        <div className="w-1/2 p-10">
          <img src="/metaverse_man.svg" />          
        </div>
      </div>
      <div className="flex mb-4">
        <div className="w-1/4 bg-gray-500 h-12"></div>
        <div className="w-1/4 bg-gray-400 h-12"></div>
        <div className="w-1/4 bg-gray-500 h-12"></div>
        <div className="w-1/4 bg-gray-400 h-12"></div>
      </div>      
    </section>
  );
};

export default Metaverse;
