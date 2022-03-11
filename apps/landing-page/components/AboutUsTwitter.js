import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import TwitterCard from "../components/TwitterCard";
import content from "../content/en_EN.json";
import leftArrow from "../public/left_arrow.png";
import rightArrow from "../public/right_arrow.png";

const AboutUsTwitter = ({ twitterPosts }) => {
  return (
    <section
      className={`bg-primary w-full justify-evenly content-center text-center overflow-hidden`}
    >
      <div className="flex mb-4 container mx-auto px-6">
        <div className="w-full content-center text-center">
          <h3 className="title-gradient uppercase font-light text-4xl md:text-5xl mb-4">
            {content.about_us_twitter.title}
          </h3>
        </div>
      </div>
      <div className="max-w-screen-sm mx-auto flex items-center gap-x-6 px-6">
        <div className="swiper-arrow-left-custom h-[25px] w-[16px] flex-none">
          <Image src={leftArrow} alt="left arrow" />
        </div>
        <Swiper
          spaceBetween={30}
          speed={1000}
          centeredSlides
          slidesPerView={"auto"}
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-arrow-right-custom",
            prevEl: ".swiper-arrow-left-custom",
          }}
        >
          {twitterPosts.map((box) => {
            return (
              <SwiperSlide
                key={box.id}
                className={`my-10 w-[240px] md:w-[290px]`}
              >
                <TwitterCard twitterPost={box} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="swiper-arrow-right-custom h-[25px] w-[16px] flex-none">
          <Image src={rightArrow} alt="right arrow" />
        </div>
      </div>
    </section>
  );
};

export default AboutUsTwitter;
