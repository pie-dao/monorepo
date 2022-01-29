import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import TwitterCard from "../components/TwitterCard";
import styles from "../styles/AboutUsTwitter.module.scss";
import content from "../content/en_EN.json";

const AboutUsTwitter = ({ twitterPosts }) => {
  const controlFifthSlide = (slider) => {
    slider.slides.map((slide) =>
      slide.classList.remove("swiper-slide-fourth", "swiper-slide-fifth")
    );

    slider.slides[slider.activeIndex + 2]?.classList.add("swiper-slide-fourth");
    slider.slides[slider.activeIndex + 3]?.classList.add("swiper-slide-fifth");
  };
  return (
    <section
      className={`bg-primary w-full justify-evenly flex-col content-center text-center flexmd:flex-col overflow-hidden`}
    >
      <div className="flex mb-4 ml-12 mr-12">
        <div className="w-full pt-[5pc] content-center text-center">
          <h1 className="text-4xl text-highlight uppercase">
            {content.about_us_twitter.title}
          </h1>
        </div>
      </div>
      <Swiper
        spaceBetween={30}
        speed={1000}
        slidesPerView={"auto"}
        className={`container ${styles.swiperSlider} mb-10`}
        centeredSlides
        modules={[Navigation]}
        navigation
        onAfterInit={(slider) => {
          controlFifthSlide(slider);
        }}
        onSlideChange={(slider) => {
          controlFifthSlide(slider);
        }}
        breakpoints={{
          768: {
            slidesPerView: 4,
            centeredSlides: false,
          },
        }}
      >
        {twitterPosts.map((box) => {
          return (
            <SwiperSlide key={box.id} className={`my-10`}>
              <TwitterCard twitterPost={box} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default AboutUsTwitter;
