import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import content from "../content/en_EN.json";
import pies from "../config/pies.json";

const ScrollingBoxes = ({}) => {
  let play = pies["0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"];

  return (
    <section
      className={`w-full justify-evenly content-center text-center relative overflow-hidden lg:overflow-visible`}
    >
      <img
        className="z-40 absolute -top-3 hidden md:block"
        src="./bg_front_line_1.svg"
      />
      <img
        className="z-40 absolute -top-3 hidden md:block"
        src="./bg_front_line_2.svg"
      />
      <img
        className="z-40 absolute -top-3 md:hidden block"
        src="./bg_front_line_1_mobile.svg"
      />
      <img
        className="z-40 absolute -top-3 md:hidden block"
        src="./bg_front_line_2_mobile.svg"
      />
      {/* <img className="z-50 absolute w-24 ml-[48%] mt-20 shadow-sm" src="./logo_play.svg" /> */}
      <div className="bg-secondary absolute p-8 z-30 w-full">
        <p className="z-50 uppercase text-xl md:text-4xl">
          underlying <span className="font-bold">tokens</span>
        </p>
      </div>

      <div className="container mx-auto relative rounded-xl mt-28">
        <Swiper
          spaceBetween={10}
          slidesPerView={"auto"}
          centeredSlides
          watchSlidesProgress
          breakpoints={{
            768: {
              centeredSlides: false,
            },
          }}
          className="w-full"
        >
          {play.composition.map((pie) => {
            return (
              <SwiperSlide key={pie.address} className="w-[150px] my-10">
                {({ isActive }) => (
                  <div
                    className={`w-full rounded-md bg-secondary flex flex-col items-center justify-center text-left  p-4 ${
                      !isActive && "opacity-75 md:opacity-100"
                    }`}
                  >
                    <img
                      className="absolute -top-6 left-3"
                      src={`/assets/${pie.icon}`}
                    />
                    <div className="w-full relative">
                      <p className="w-full text-sm pt-8 pb-6">23%</p>
                      <p className="text-xl text-bold">{pie.symbol}</p>
                      <p className="text-xl text-extrabold text-highlight">
                        3.45$
                      </p>
                      <div className="bg-blue-600 h-[70%] rounded-full w-2.5 absolute bottom-0 right-0"></div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default ScrollingBoxes;
