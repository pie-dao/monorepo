import Button from './Button';
import Image from 'next/image';
import sushiswapLogo from '../public/sushiswap_logo.png';
import oneInch from '../public/1inch.png';
import uniswap from '../public/uniswap.png';
import roiPlaceholder from '../public/roi_placeholder.png';
import content from '../content/en_EN.json';

const Roi = ({}) => {
  return (
    <section className={`w-full my-10`}>
      <div className="bg-secondary relative grid content-around justify-center my-24 w-full">
        <div className="container mx-auto px-6">
          <div className="bg-highlight z-20 relative -top-16 sm:-top-12 text-2xl p-4 mx-4 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="font-light">{content.roi.title.first}</p>
            <p className="font-bold">{content.roi.title.highlighted}</p>
          </div>
          <div className="bg-black z-20 relative uppercase text-xl p-4 md:rounded-xl flex flex-col items-center justify-center">
            <div className="w-full flex mb-4 flex-col md:flex-row">
              <div className="w-full md:w-1/4 flex flex-col items-center text-center justify-center">
                <p className="text-gradient">
                  {content.roi.prices.starting_price}
                </p>
                <p className="font-light text-sm text-deep_purple">
                  {content.roi.prices.starting_price_date}
                </p>
              </div>
              <div className="w-full md:w-3/4">
                <Image
                  lazyBoundary="325px"
                  placeholder="blur"
                  src={roiPlaceholder}
                  alt="ROI Placeholder"
                />
              </div>
              <div className="w-full md:w-1/4 flex flex-col items-center text-center justify-center">
                <p className="text-gradient">
                  {content.roi.prices.ending_price}
                </p>
                <p className="font-light text-sm text-deep_purple">
                  {content.roi.prices.ending_price_date}
                </p>
              </div>
            </div>
          </div>
          <div className="pt-4 relative z-20 flex flex-col items-center text-center justify-center">
            <p className="font-bold text-sm md:text-xl">
              {content.roi.description_highlight}
            </p>
            <p className="text-sm md:text-xl">{content.roi.description}</p>
          </div>
          <div className="relative top-6 z-20 flex flex-col items-center text-center justify-center">
            <Button
              href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase flex items-center px-8 button gradient"
            >
              <>
                <span className="font-bold mr-2">{content.roi.cta}</span>
                <Image
                  lazyBoundary="325px"
                  src={sushiswapLogo}
                  alt="sushiswap logo"
                />
              </>
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6">
        <p className="text-center uppercase text-sm text-deep_purple mb-4">
          {content.roi.find_it_also}
        </p>
        <div className="flex justify-center items-center gap-x-10">
          <a
            href="https://app.1inch.io/#/1/swap/ETH/0x33e18a092a93ff21ad04746c7da12e35d34dc7c4/import-token"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center uppercase"
            id="btn-1inch-cta"
          >
            <Image lazyBoundary="325px" src={oneInch} alt="1inch Logo" />
            <p className="ml-2">{content.roi.one_inch}</p>
          </a>
          <a
            href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x33e18a092a93ff21ad04746c7da12e35d34dc7c4&chain=mainnet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center uppercase"
            id="btn-uniswap-cta"
          >
            <div>
              <Image lazyBoundary="325px" src={uniswap} alt="uniswap Logo" />
            </div>
            <p className="ml-2">{content.roi.uniswap}</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Roi;
