import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Dialog } from "@headlessui/react";
import Button from "./Button";

import Modal from "./Modal";
import greenCheckmark from "../public/double-checkmark.svg";
import styles from "../styles/Methodology.module.scss";
import content from "../content/en_EN.json";

const ModalContent = () => {
  return (
    <>
      <Dialog.Title
        as="h3"
        className="text-2xl leading-6 text-highlight font-bold uppercase"
      >
        {content.modal.section_1.title}
      </Dialog.Title>
      <div className="mt-4 mb-8 text-sm text-white">
        <p>{content.modal.section_1.description}</p>
        <ul>
          {content.modal.section_1.points.map((point) => (
            <li key={point.id} className="text-sm text-white flex items-center">
              <Image
                src={greenCheckmark}
                alt="Green checkmark"
                aria-hidden="true"
                width={20}
              />
              <span className="ml-2">{point.description}</span>
            </li>
          ))}
        </ul>
        <p>{content.modal.section_1.description_2}</p>
      </div>

      <Dialog.Title
        as="h3"
        className="text-2xl leading-6 text-highlight font-bold uppercase"
      >
        {content.modal.section_2.title}
      </Dialog.Title>
      <div className="mt-4 mb-8 text-sm text-white">
        <p>{content.modal.section_2.description_1}</p>
        <ul>
          {content.modal.section_2.points_1.map((point) => (
            <li key={point.id} className="text-sm text-white flex items-center">
              <Image
                src={greenCheckmark}
                alt="Green checkmark"
                aria-hidden="true"
                width={20}
              />
              <span className="ml-2">{point.description}</span>
            </li>
          ))}
        </ul>
        <p className="mb-2">{content.modal.section_2.notes}</p>
        <p>{content.modal.section_2.description_2}</p>
        <ul>
          {content.modal.section_2.points_2.map((point) => (
            <li key={point.id} className="text-sm text-white flex items-center">
              <Image
                src={greenCheckmark}
                alt="Green checkmark"
                aria-hidden="true"
                width={20}
              />
              <span className="ml-2">{point.description}</span>
            </li>
          ))}
        </ul>
      </div>
      <Dialog.Title
        as="h3"
        className="text-2xl leading-6 text-highlight font-bold uppercase"
      >
        {content.modal.section_3.title}
      </Dialog.Title>
      <div className="mt-4 mb-8 text-sm text-white">
        <p>{content.modal.section_3.description}</p>
      </div>
      <div className="mt-4">
        <Button
          className="text-white uppercase"
          href="https://gateway.pinata.cloud/ipfs/QmcNBx57qyjsuENaTZunsG7C12PN8i9t9BKjzaWzGSaBVK"
          target="_blank"
        >
          {content.modal.download}
        </Button>
      </div>
    </>
  );
};

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
      <div className="flex mb-4 container mx-auto px-6">
        <div className="w-full content-center text-center">
          <h2 className="text-highlight uppercase text-4xl md:text-5xl mb-4">
            Methodology <span className="font-bold">& Strategy</span>
          </h2>
          <p className="text-sm md:text-xl">
            {content.methodology.description}
          </p>
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
                <div
                  className={`p-1 rounded-md border-2 border-transparent ${styles.gradient}`}
                >
                  <div className="w-full rounded-md bg-primary p-4 flex flex-col items-center justify-center text-center h-72">
                    <div className="flex flex-1 items-center">
                      <p className="p-2 text-sm md:text-md">
                        {box.description}
                      </p>
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
      <div className="container mx-auto px-6">
        <p className="text-deep_blue">
          For detailed information on allocation and rebalancing procedures{" "}
          <button
            type="button"
            className="text-highlight cursor-pointer"
            onClick={openModal}
            data-ga="read-prospectus"
          >
            read the prospectus.
          </button>
        </p>
      </div>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <ModalContent />
      </Modal>
    </section>
  );
};

export default Methodology;
