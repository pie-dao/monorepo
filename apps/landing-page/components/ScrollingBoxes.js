import { Swiper, SwiperSlide } from "swiper/react";
import SingleBox from "./SingleBox";
import content from "../content/en_EN.json";
import styles from "../styles/ScrollingBoxes.module.scss";

const ScrollingBoxes = ({}) => {
  return (
    <section
      className={`w-full justify-evenly content-left text-left overflow-hidden lg:overflow-visible`}
    >
      <div className="w-full z-20 sticky top-20 bg-secondary h-60 text-center lg:text-left -mt-20">
        <div className="container mx-auto px-4 pt-8">
          <p className="uppercase text-4xl">
            Easy access to
            <br />
            <span className="font-bold">the metaverse</span>
          </p>
          <p className="hidden lg:block lg:w-1/3 pt-4">
            {content.scrolling_boxes.description}
          </p>
        </div>
      </div>
      <div className="z-20 sticky flex mb-4 lg:-mt-60 lg:justify-end">
        <div className="lg:container lg:mx-auto w-full px-4">
          <div className="flex lg:hidden w-full">
            <Swiper
              observer
              speed={1000}
              slidesPerView={"auto"}
              centeredSlides
              className={`w-full overflow-visible mt-44 ${styles.swiperSlider}`}
            >
              {content.scrolling_boxes.boxes.map((box) => {
                return (
                  <SwiperSlide key={box.id} className={`w-[280px] flex`}>
                    <SingleBox singleBox={box} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="hidden w-1/2 lg:flex flex-col ml-auto mt-32">
            {content.scrolling_boxes.boxes.map((box) => (
              <SingleBox singleBox={box} key={box.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollingBoxes;
