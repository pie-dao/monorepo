import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from "./Loader";
import useUnderlyingData from "../hooks/useUnderlyingData";
import priceFormatter from "../utils/priceFormatter";
import Image from "next/image";
import tokenImages from "../public/assets";
import playLogo from "../public/play_icon.png";
import gradientPicker from "../utils/gradientPicker";
import styles from "../styles/UnderlyingTokens.module.scss";
import content from "../content/en_EN.json";

const UnderlyingTokens = () => {
  const { underlyingData, isLoading, isError } = useUnderlyingData();

  const sortedAssets = useMemo(() => {
    return underlyingData?.history[0].underlyingAssets.sort((a, b) => {
      return b.marginalTVLPercentage - a.marginalTVLPercentage;
    });
  }, [underlyingData]);

  const relativePercentage = (percentage) => {
    const maxPercentage = sortedAssets[0].marginalTVLPercentage;
    return ((percentage * 100) / maxPercentage).toFixed(2);
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
        <Image placeholder="blur" src={playLogo} alt="play logo" />
      </div>
      <div className="mx-4">
        {isLoading || isError ? (
          <Loader />
        ) : (
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
              ({ address, symbol, usdPrice, marginalTVLPercentage }) => {
                const imageObj = tokenImages.find(
                  (token) => token.name === symbol
                );
                const percentage = (+marginalTVLPercentage).toFixed(2);
                return (
                  <SwiperSlide key={address} className="w-[150px] mt-6">
                    {({ isActive }) => (
                      <div
                        className={`w-full rounded-md bg-secondary flex flex-col items-center justify-center text-left  p-4 ${
                          !isActive && "opacity-75 md:opacity-100"
                        }`}
                      >
                        <div className="absolute -top-6 left-3">
                          <Image
                            placeholder="blur"
                            src={imageObj.image}
                            alt={symbol}
                          />
                        </div>
                        <div className="w-full relative">
                          <p className="w-full text-md pt-8 pb-6">
                            {percentage}%
                          </p>
                          <p className="text-xl font-extrabold">{symbol}</p>
                          <p className="text-xl font-bold text-highlight">
                            {priceFormatter.format(usdPrice)}
                          </p>
                          <div
                            className={`bg-blue-600 rounded-full w-2.5 absolute bottom-0 right-0`}
                            style={{
                              height: `${relativePercentage(percentage)}%`,
                              backgroundColor: `${barColor(
                                relativePercentage(percentage)
                              )}`,
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
        )}
      </div>
    </section>
  );
};

export default UnderlyingTokens;
