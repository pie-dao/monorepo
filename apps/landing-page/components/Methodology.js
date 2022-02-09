import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import Modal from "./Modal";
import greenCheckmark from "../public/double-checkmark.svg";
import styles from "../styles/Methodology.module.scss";
import content from "../content/en_EN.json";

const Methodology = ({}) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <section
      className={`bg-primary w-full justify-evenly content-center text-center overflow-hidden`}
    >
      <div className="flex mb-4 container mx-auto px-4">
        <div className="w-full content-center text-center">
          <h1 className="text-4xl text-highlight uppercase">
            Methodology <span className="font-bold">& Strategy</span>
          </h1>
          <h2>{content.methodology.description}</h2>
        </div>
      </div>
      <div className="max-w-screen-sm mx-auto">
        <Swiper
          speed={1000}
          slidesPerView={"auto"}
          centeredSlides
          className={`${styles.swiperSlider} mb-10`}
          modules={[Navigation]}
          navigation
        >
          {content.methodology.boxes.map((box) => {
            return (
              <SwiperSlide key={box.id} className={`w-[220px] my-10`}>
                <div className="p-1 rounded-md bg-gradient-to-tr from-red-500 to-blue-500">
                  <div className="w-full rounded-md bg-primary p-4 flex flex-col items-center justify-center text-center h-72">
                    <div className="flex flex-1 items-center">
                      <p className="p-2">{box.description}</p>
                    </div>
                    <div>
                      <Image src={greenCheckmark} alt="green checkmark" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="container mx-auto px-4">
        <p className="text-deep_blue">
          For detailed information on allocation and rebalancing procedures{" "}
          <a className="text-highlight cursor-pointer" onClick={openModal}>
            read the prospectus.
          </a>
        </p>
      </div>
      <Modal isOpen={isOpen} closeModal={closeModal} />
    </section>
  );
};

export default Methodology;
