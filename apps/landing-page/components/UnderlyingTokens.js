import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import tokenImages from "../public/assets";
import playLogo from "../public/play_icon.svg";
import gradientPicker from "../utils/gradientPicker";
import styles from "../styles/UnderlyingTokens.module.scss";
import content from "../content/en_EN.json";

const ScrollingBoxes = ({ underlyingAssets }) => {
  const sortedAssets = useMemo(() => {
    return underlyingAssets.sort((a, b) => {
      return b.pieDAOMarketCapPercentage - a.pieDAOMarketCapPercentage;
    });
  }, [underlyingAssets]);

  const relativePercentage = (underlyingPercentage) => {
    const maxPercentage = sortedAssets[0].pieDAOMarketCapPercentage;
    return ((underlyingPercentage * 100) / maxPercentage).toFixed(2);
  };

  const barColor = (ratio) => {
    return gradientPicker([215, 11, 154], [143, 235, 255], ratio);
  };

  return (
    <section
      className={`w-full justify-evenly content-center text-center relative overflow-hidden mb-20`}
    >
      <div className="bg-secondary py-8 w-full relative">
        <div className="container mx-auto px-6">
          <h2 className="uppercase text-4xl md:text-5xl mb-4">
            {content.underlying_tokens.title.first}{" "}
            <span className="font-bold">
              {content.underlying_tokens.title.highlighted}
            </span>
          </h2>
        </div>
      </div>
      <div className="-mt-12 relative z-1">
        <Image src={playLogo} alt="play logo" />
      </div>
      <div className="mx-4">
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={10}
          centeredSlides
          watchSlidesProgress
          breakpoints={{
            768: {
              centeredSlides: false,
            },
          }}
          className={`mx-auto flex ${styles.underlyingTokensSlider}`}
        >
          {sortedAssets.map(
            ({ address, symbol, token_info, pieDAOMarketCapPercentage }) => {
              const imageObj = tokenImages.find(
                (token) => token.name === symbol
              );
              const percentage = (+pieDAOMarketCapPercentage).toFixed(2);
              const relPerc = relativePercentage(percentage);
              return (
                <SwiperSlide key={address} className="w-[150px] mt-6">
                  {({ isActive }) => (
                    <div
                      className={`w-full rounded-md bg-secondary flex flex-col items-center justify-center text-left  p-4 ${
                        !isActive && "opacity-75 md:opacity-100"
                      }`}
                    >
                      <div className="absolute -top-6 left-3">
                        <Image src={imageObj.image} alt={symbol} />
                      </div>
                      <div className="w-full relative">
                        <p className="w-full text-md pt-8 pb-6">
                          {percentage}%
                        </p>
                        <p className="text-xl font-extrabold">{symbol}</p>
                        <p className="text-xl font-bold text-highlight">
                          {token_info.usd.toFixed(2)}$
                        </p>
                        <div
                          className={`bg-blue-600 rounded-full w-2.5 absolute bottom-0 right-0`}
                          style={{
                            height: `${relPerc}%`,
                            backgroundColor: `${barColor(relPerc)}`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              );
            }
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default ScrollingBoxes;
