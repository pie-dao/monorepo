import Image from "next/image";
import metaverseMan from "../public/metaverse_man.png";
import content from "../content/en_EN.json";

const Metaverse = ({}) => {
  return (
    <section className="bg-primary w-full justify-evenly content-center mt-8 container mx-auto px-6">
      <div>
        <div className="flex flex-col md:flex-row mb-4">
          <div className="w-full justify-center flex flex-col">
            <h2 className="w-full text-highlight uppercase font-light text-4xl md:text-5xl mb-4">
              {content.metaverse.title.first}{" "}
              <span className="font-bold">
                {content.metaverse.title.highlighted}
              </span>
            </h2>
            <p className="text-sm md:text-xl">
              {content.metaverse.description}
            </p>
            <div className=" flex flex-col md:flex-row mb-4 mt-4 gap-2 items-start">
              <div className="flex flex-col w-full md:w-1/2 pl-4 relative">
                <div className="bg-gradient-to-r from-highlight to-highlight_secondary h-full rounded-full w-1.5 absolute left-0 right-0"></div>
                <p className="text-sm md:text-xl">
                  {content.metaverse.details_left}
                </p>
              </div>
              <div className="flex flex-col w-full md:w-1/2 pl-4 relative">
                <div className="bg-gradient-to-r from-highlight to-highlight_secondary h-full rounded-full w-1.5 absolute left-0 right-0"></div>
                <p className="text-sm md:text-xl">
                  {content.metaverse.details_right}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full order-first md:order-last">
            <Image src={metaverseMan} alt="metaverse man" />
          </div>
        </div>
      </div>
      <div className="bg-[length:100%_100%] bg-no-repeat bg-cover bg-[url('/bg_single_line.svg')] mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:pb-24 ">
          <div className="flex flex-col md:text-center">
            <h4 className="text-highlight_secondary text-2xl md:text-3xl lg:text-4xl">
              <span className="font-bold">
                {content.metaverse.info_boxes.first.title_highlight}{" "}
              </span>
              {content.metaverse.info_boxes.first.title}
            </h4>
            <p className="text-sm md:text-xl">
              {content.metaverse.info_boxes.first.sub_title}
            </p>
          </div>
          <div className="flex flex-col md:mt-36 md:text-center">
            <h4 className="text-highlight_secondary text-2xl md:text-3xl lg:text-4xl">
              <span className="font-bold">
                {content.metaverse.info_boxes.second.title_highlight}{" "}
              </span>
              {content.metaverse.info_boxes.second.title}
            </h4>
            <p className="text-sm md:text-xl">
              {content.metaverse.info_boxes.second.sub_title}
            </p>
          </div>
          <div className="flex flex-col md:text-center">
            <h4 className="text-highlight_secondary text-2xl md:text-3xl lg:text-4xl font-bold font-bold">
              {content.metaverse.info_boxes.third.title}
            </h4>
            <p className="text-sm md:text-xl">
              {content.metaverse.info_boxes.third.sub_title}
            </p>
          </div>
          <div className="flex flex-col md:mt-36 md:text-center">
            <h4 className="text-highlight_secondary text-2xl md:text-3xl lg:text-4xl">
              <span className="font-bold">
                {content.metaverse.info_boxes.fourth.title_highlight}{" "}
              </span>
              {content.metaverse.info_boxes.fourth.title}
            </h4>
            <p className="text-sm md:text-xl">
              {content.metaverse.info_boxes.fourth.sub_title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Metaverse;
