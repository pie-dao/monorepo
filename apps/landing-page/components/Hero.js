import { useMemo } from 'react';
import Image from 'next/image';
import pieDaoLogo from '../public/piedao_logo.png';
import separator from '../public/separator.svg';
import arrowUp from '../public/arrow_green.svg';
import content from '../content/en_EN.json';
import Button from './Button';

const Hero = ({ actualPrice }) => {
  const inceptionPerc = useMemo(() => {
    return ((actualPrice - 1) * 100).toFixed();
  }, [actualPrice]);

  return (
    <section
      className={`
      bg-primary w-full justify-evenly content-center grid grid-cols-1
      text-center min-h-screen bg-no-repeat bg-cover 
      bg-[length:100%_100%] bg-[url('/bg_lines.svg')] mb-8`}
    >
      <div className="container mx-auto px-6">
        <div className="hidden md:block mb-8">
          <Image
            lazyBoundary="325px"
            priority
            src={pieDaoLogo}
            alt="PieDao Logo"
          />
        </div>
        <div className="hidden md:block mb-10">
          <Image
            lazyBoundary="325px"
            priority
            src={separator}
            alt="separator"
          />
        </div>
        <div className="mb-12">
          <h2 className="font-bold uppercase text-sm md:text-3xl">
            {content.hero.sub_title}
          </h2>
          <div className="relative mb-6 overflow-hidden">
            <h1 className="uppercase text-4xl md:text-5xl lg:text-6xl xl:text-8xl title-gradient">
              {content.hero.title}
            </h1>
            <p className="absolute uppercase text-4xl md:text-5xl lg:text-6xl xl:text-8xl title-gradient w-full top-2 left-6 opacity-25">
              {content.hero.title}
            </p>
            <p className="absolute uppercase text-4xl md:text-5xl lg:text-6xl xl:text-8xl title-gradient w-full top-2 right-6 opacity-25">
              {content.hero.title}
            </p>
          </div>
          <p className="font-bold text-sm md:text-xl">
            {content.hero.content_highlight}
          </p>
          <p className="text-sm md:text-xl mt-6 md:mt-0">
            {content.hero.content_text}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Button
            className="uppercase mb-4 px-8"
            gradient
            href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"
            target="_blank"
            rel="noopener noreferrer"
            id="sushiswap-hero"
          >
            {content.hero.call_to_action}
          </Button>
          {inceptionPerc && inceptionPerc > 0 && (
            <div className="flex justify-center relative flex-col items-center">
              <div>
                <Image
                  lazyBoundary="325px"
                  priority
                  src={arrowUp}
                  alt="arrow up"
                  className="up"
                />
              </div>
              <h5 className="glitch mt-2">
                <span aria-hidden="true">+{inceptionPerc}%</span>+
                {inceptionPerc}%
                <span aria-hidden="true">+{inceptionPerc}%</span>
              </h5>
              <h6 className="glitch">
                <span aria-hidden="true">{content.hero.call_to_text_2}</span>
                {content.hero.call_to_text_2}
                <span aria-hidden="true">{content.hero.call_to_text_2}</span>
              </h6>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
