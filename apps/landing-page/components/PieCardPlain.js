import Image from 'next/image';
import { useMemo } from 'react';
import { Popover } from '@headlessui/react';
import piesImages from '../public/pies';
import backgroundImage from '../public/explore_products_bg.png';
import popover from '../public/popover_icon.svg';
import Button from './Button';
import content from '../content/en_EN.json';
import priceFormatter from '../utils/priceFormatter';

const PieCardPlain = ({ pieInfo, pieHistory }) => {
  const tokenImage = useMemo(
    () => piesImages.find((token) => token.name === pieInfo.symbol),
    [pieInfo.symbol],
  );

  const swapWebsite = (pieAddress) => {
    if (pieAddress === '0x8d1ce361eb68e9e05573443c407d4a3bed23b033') {
      return 'https://www.piedao.org/#/oven';
    }
    if (pieAddress === '0xe4f726adc8e89c6a6017f01eada77865db22da14') {
      return 'https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0xe4f726adc8e89c6a6017f01eada77865db22da14';
    }
    return 'https://www.piedao.org/#/swap';
  };

  return (
    <div className="flex flex-col w-full max-w-[425px] relative">
      <div className="h-[320px] rounded-lg relative bg-[#7A32FE]">
        <div className="w-full h-full flex flex-col">
          <div className="relative -top-6">
            <div className="w-[50px] h-[50px] mx-auto z-10">
              <Image
                lazyBoundary="325px"
                src={tokenImage.image}
                className="rounded-full"
                alt={pieInfo.symbol}
              />
            </div>
            <h3 className="text-3xl text-white font-extrabold uppercase mt-3">
              {pieInfo.symbol}
            </h3>
            <h4 className="text-sm text-white uppercase">{pieInfo.name}</h4>
          </div>
          {/* <div className="text-2xl text-white font-extrabold mx-auto mt-auto flex items-end mb-2 z-10">
            <span>{content.explore_products.nav.name}</span>{' '}
            <Popover className="relative flex self-start">
              <Popover.Button className="ml-1">
                <Image lazyBoundary="325px" src={popover} alt="popover" />
              </Popover.Button>
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-[40%] left-[50%] bottom-full sm:px-0">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-white p-7">
                    <p className="text-sm text-black">
                      {content.explore_products.nav.tooltip}
                    </p>
                  </div>
                </div>
              </Popover.Panel>
            </Popover>
            <span className="text-4xl ml-4">
              {priceFormatter.format(pieHistory[0].nav)}
            </span>
          </div> */}
        </div>
        <div className="absolute -bottom-2">
          <Image
            lazyBoundary="325px"
            priority
            src={backgroundImage}
            alt="background"
          />
        </div>
      </div>
      <div className="flex gap-x-4 mt-4 uppercase">
        <Button
          className="w-full"
          href={`https://www.piedao.org/#/pie/${pieInfo.address}`}
          target="_blank"
          rel="noreferrer noopener"
          inverted
        >
          Discover
        </Button>
        <Button
          className="w-full uppercase"
          href={swapWebsite(pieInfo.address)}
          target="_blank"
          rel="noreferrer noopener"
          id={`btn-buy-${pieInfo.symbol}`}
        >
          BUY
        </Button>
      </div>
    </div>
  );
};

export default PieCardPlain;
