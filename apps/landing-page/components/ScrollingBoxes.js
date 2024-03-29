import { Swiper, SwiperSlide } from 'swiper/react';
import SingleBox from './SingleBox';
import content from '../content/en_EN.json';
import styles from '../styles/ScrollingBoxes.module.scss';

const ScrollingBoxes = () => {
  return (
    <section
      className={`w-full justify-evenly content-left text-left overflow-hidden lg:overflow-visible`}
    >
      <div className="w-full z-20 sticky top-24 bg-secondary h-fit pb-10 text-center lg:text-left -mt-20">
        <div className="container mx-auto px-6 pt-8">
          <h2 className="uppercase text-4xl md:text-5xl mb-4">
            {content.scrolling_boxes.title.first}
            <br />
            <span className="font-bold">
              {content.scrolling_boxes.title.highlighted}
            </span>
          </h2>
          <p className="hidden lg:block lg:w-1/3 pt-4 text-sm md:text-xl">
            {content.scrolling_boxes.description}
          </p>
          <p className="hidden lg:block lg:w-1/3 pt-4 text-sm md:text-xl">
            <span className="flex mb-2 font-bold">
              {content.scrolling_boxes.subparagraph.title}
            </span>
            {content.scrolling_boxes.subparagraph.content}
          </p>
        </div>
      </div>
      <div className="z-20 sticky flex mb-4 mt-20 lg:-mt-[28rem] lg:justify-end">
        <div className="lg:container lg:mx-auto w-full px-4">
          <div className="flex lg:hidden w-full">
            <Swiper
              observer
              speed={1000}
              slidesPerView={'auto'}
              centeredSlides
              className={`w-full overflow-visible mt-64 ${styles.swiperSlider}`}
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
