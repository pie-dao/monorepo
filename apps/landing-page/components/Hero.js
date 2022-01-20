import Image from "next/image";
import content from "../content/en_EN.json";

const Hero = ({}) => {
  return (
    <section className={`bg-primary w-full justify-evenly content-center text-center pt-40 bg-no-repeat bg-contain bg-center bg-[url('/bg_lines.svg')] h-[634px]`}>
      <div className="pb-16">
        <h2 className="uppercase text-xl">{content.hero.sub_title}</h2>
        <h1 className="uppercase text-4xl">{content.hero.title}</h1>
        <p className="font-bold">{content.hero.content_highlight}</p>
        <p>{content.hero.content_text}</p>            
      </div>
      <div className="">
        <button className="pl-1 pr-1 pt-4 pb-4 rounded-md bg-gradient-to-tr from-red-500 to-blue-500">
          <span className="rounded-md bg-primary p-4">{content.hero.call_to_action}</span>
        </button>
        <div className="p-2 flex justify-center">
          <p className="pr-2">{content.hero.call_to_text}</p>
          <img src="/green_arrow.svg" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
