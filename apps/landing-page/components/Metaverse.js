import Image from "next/image";
import content from "../content/en_EN.json";

const Metaverse = ({}) => {
  return (
    <section className={`bg-primary w-full justify-evenly content-center text-center flex flex-row md:flex-col`}>
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
      <div className="flex items-center justify-center bg-[center_top_1rem] bg-no-repeat bg-cover bg-[url('/bg_single_line.svg')] h-80 text-center">
        <div className="w-1/4 -mt-40">
          <p className="text-highlight_secondary text-4xl">{content.metaverse.info_boxes.first.title}</p>
          <p>{content.metaverse.info_boxes.first.sub_title}</p>
        </div>
        <div className="w-1/4">
        <p className="text-highlight_secondary text-4xl">{content.metaverse.info_boxes.second.title}</p>
          <p>{content.metaverse.info_boxes.second.sub_title}</p>
        </div>
        <div className="w-1/4 -mt-40">
        <p className="text-highlight_secondary text-4xl">{content.metaverse.info_boxes.third.title}</p>
          <p>{content.metaverse.info_boxes.third.sub_title}</p>
        </div>
        <div className="w-1/4">
          <p className="text-highlight_secondary text-4xl">{content.metaverse.info_boxes.fourth.title}</p>
          <p>{content.metaverse.info_boxes.fourth.sub_title}</p>
        </div>                
      </div>      
    </section>
  );
};

export default Metaverse;
