import { Swiper, SwiperSlide } from "swiper/react";
import SingleBox from "./SingleBox";
import content from "../content/en_EN.json";
import styles from "../styles/ScrollingBoxes.module.scss";

const ScrollingBoxes = ({}) => {
  return (
    <section
      className={`w-full justify-evenly content-left text-left m-10 overflow-hidden lg:overflow-visible`}
    >
      <div className="z-20 sticky top-20 bg-secondary p-6 lg:pl-24 lg:pr-24 h-60 text-center lg:text-left">
        <div className="container mx-auto">
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
      <div className="z-20 sticky flex mb-4 lg:-mt-60 justify-end">
        <div className="container mx-auto">
          <div className="flex lg:hidden">
            <Swiper
              spaceBetween={-50}
              speed={1000}
              slidesPerView={"auto"}
              centeredSlides
              updateOnWindowResize
              breakpoints={{
                768: {
                  spaceBetween: -70,
                },
              }}
              className={`w-full ${styles.swiperSlider}`}
            >
              {content.scrolling_boxes.boxes.map((box) => {
                return (
                  <SwiperSlide
                    key={box.id}
                    className={`w-[280px] md:w-[360px] lg:w-full`}
                  >
                    <SingleBox singleBox={box} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="hidden w-1/2 lg:flex flex-col ml-auto mr-4">
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
