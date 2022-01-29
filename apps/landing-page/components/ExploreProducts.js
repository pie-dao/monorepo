import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import PieCard from "./PieCard";
import styles from "../styles/ExploreProducts.module.scss";
import content from "../content/en_EN.json";

const ExploreProducts = ({ coingeckoData }) => {
  const pies = Object.keys(coingeckoData)
    .filter((key) => key.includes("piedao-"))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: coingeckoData[key],
      };
    }, {});

  return (
    <section
      className={`bg-primary w-full justify-evenly flex-col content-center text-center flexmd:flex-col overflow-hidden`}
    >
      <div className="flex mb-4 ml-12 mr-12">
        <div className="w-full pt-[5pc] content-center text-center">
          <h2 className="text-4xl text-highlight uppercase">
            {content.explore_products.title.first}
            <span className="text-highlight">
              {content.explore_products.title.highlighted}
            </span>
          </h2>
        </div>
      </div>
      <Swiper
        spaceBetween={30}
        speed={1000}
        slidesPerView={"auto"}
        className={`container ${styles.swiperSlider} mb-10`}
        modules={[Navigation]}
        navigation
      >
        {Object.keys(pies).map((key) => {
          return (
            <SwiperSlide key={key} className="h-[320px] w-[265px]">
              <ParentSize>
                {({ width, height }) => (
                  <PieCard pie={pies[key]} height={height} width={width} />
                )}
              </ParentSize>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default ExploreProducts;
