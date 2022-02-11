import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import TwitterCard from "../components/TwitterCard";
import content from "../content/en_EN.json";

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
      <div className="max-w-screen-sm mx-auto">
        <Swiper
          spaceBetween={30}
          speed={1000}
          centeredSlides
          slidesPerView={"auto"}
          className={`mb-10`}
          modules={[Navigation]}
          navigation
        >
          {twitterPosts.map((box) => {
            return (
              <SwiperSlide key={box.id} className={`w-[295px] my-10`}>
                <TwitterCard twitterPost={box} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default AboutUsTwitter;
