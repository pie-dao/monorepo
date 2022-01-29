import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import styles from "../styles/Methodology.module.scss";
import content from "../content/en_EN.json";

const Methodology = ({}) => {
  const controlFifthSlide = (slider) => {
    slider.slides.map((slide) =>
      slide.classList.remove(
        "swiper-slide-fifth-right",
        "swiper-slide-fifth-left"
      )
    );

    slider.slides[slider.activeIndex + 2]?.classList.add(
      "swiper-slide-fifth-right"
    );
    slider.slides[slider.activeIndex - 2]?.classList.add(
      "swiper-slide-fifth-left"
    );
  };
  return (
    <section
      className={`bg-primary w-full justify-evenly flex-col content-center text-center flexmd:flex-col overflow-hidden`}
    >
      <div className="flex mb-4 ml-12 mr-12">
        <div className="w-full pt-[5pc] content-center text-center">
          <h1 className="text-4xl text-highlight uppercase">
            Methodology <span className="font-bold">& Strategy</span>
          </h1>
          <h2>{content.methodology.description}</h2>
        </div>
      </div>
      <Swiper
        spaceBetween={-60}
        speed={1000}
        slidesPerView={"auto"}
        centeredSlides
        className={`${styles.swiperSlider} mb-10`}
        modules={[Navigation]}
        navigation
        onSlideChange={(slider) => {
          controlFifthSlide(slider);
        }}
      >
        {content.methodology.boxes.map((box) => {
          return (
            <SwiperSlide key={box.id} className={`w-[240px] my-10`}>
              <div className="p-1 rounded-md bg-gradient-to-tr from-red-500 to-blue-500">
                <div className="w-full rounded-md bg-primary p-4 flex flex-col items-center justify-center text-center h-72">
                  <p className="p-2">{box.description}</p>
                  <img src={content.methodology.icon} className="mt-12" />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <p className="text-deep_blue">
        For detailed information on allocation and rebalancing procedures{" "}
        <a className="text-highlight" href="#">
          read the prospectus.
        </a>
      </p>
    </section>
  );
};

export default Methodology;
