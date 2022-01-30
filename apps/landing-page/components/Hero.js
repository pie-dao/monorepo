import content from "../content/en_EN.json";
import Button from "./Button";

const Hero = ({}) => {
  return (
    <section
      className={`
      bg-primary w-full justify-evenly content-center 
      text-center m-10 md:pt-40 bg-no-repeat bg-cover 
      -bg-[center_top_1rem] bg-[url('/bg_lines.svg')] h-[317px] md:h-[634px]`}
    >
      <div className="pl-6 pr-6 md:pl-24 md:pr-24">
        <div className="pb-8">
          <h2 className="uppercase text-sm md:text-xl">
            {content.hero.sub_title}
          </h2>
          <h1 className="uppercase text-xl md:text-4xl">
            {content.hero.title}
          </h1>
          <p className="font-bold text-sm md:text-md mt-6">
            {content.hero.content_highlight}
          </p>
          <p className="text-sm md:text-md mt-1">{content.hero.content_text}</p>
        </div>
        <div>
          <Button className="uppercase font-bold" gradient large>
            {content.hero.call_to_action}
          </Button>
          <div className="p-4 flex justify-center">
            <p className="pr-2">{content.hero.call_to_text}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
