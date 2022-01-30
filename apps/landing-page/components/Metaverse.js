import Image from "next/image";
import content from "../content/en_EN.json";

const Metaverse = ({}) => {
  return (
    <section className={`bg-primary w-full justify-evenly content-center`}>
      <div className="pl-6 pr-6 md:pl-24 md:pr-24">
        <div className="flex flex-col md:flex-row mb-4 ml-12 mr-12">
          <div className="w-full pt-4">
            <h1 className="text-4xl text-highlight uppercase">
              What <span className="font-bold">is the metaverse?</span>
            </h1>
            <h2>{content.metaverse.description}</h2>
            <div className=" flex flex-col md:flex-row mb-4 mt-4">
              <div className="flex flex-col rounded-xl w-full md:w-1/2 border-4 border-transparent border-l-highlight pl-4">
                {content.metaverse.details_left}
              </div>
              <div className="flex flex-col rounded-xl w-full md:w-1/2 border-4 border-transparent border-l-highlight pl-4">
                {content.metaverse.details_right}
              </div>
            </div>
          </div>
          <div className="w-full order-first md:order-last">
            <Image
              src="/metaverse_man.svg"
              width={661}
              height={453}
              alt="metaverse man"
            />
          </div>
        </div>
      </div>
      <div className="pl-6 pr-6 md:pl-24 md:pr-24 bg-[center_top_1rem] bg-no-repeat bg-cover bg-[url('/bg_single_line.svg')] h-80">
        <div className="flex flex-col md:flex-row items-center justify-center text-center h-80">
          <div className="w-full md:w-1/4 md:-mt-40 pb-2">
            <p className="text-highlight_secondary text-4xl">
              {content.metaverse.info_boxes.first.title}
            </p>
            <p>{content.metaverse.info_boxes.first.sub_title}</p>
          </div>
          <div className="w-full md:w-1/4 pb-2">
            <p className="text-highlight_secondary text-4xl">
              {content.metaverse.info_boxes.second.title}
            </p>
            <p>{content.metaverse.info_boxes.second.sub_title}</p>
          </div>
          <div className="w-full md:w-1/4 md:-mt-40 pb-2">
            <p className="text-highlight_secondary text-4xl">
              {content.metaverse.info_boxes.third.title}
            </p>
            <p>{content.metaverse.info_boxes.third.sub_title}</p>
          </div>
          <div className="w-full md:w-1/4 pb-2">
            <p className="text-highlight_secondary text-4xl">
              {content.metaverse.info_boxes.fourth.title}
            </p>
            <p>{content.metaverse.info_boxes.fourth.sub_title}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Metaverse;
