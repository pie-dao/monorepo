import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import greenCheckmark from "../public/double-checkmark.svg";
import close from "../public/close.svg";
import Button from "./Button";
import content from "../content/en_EN.json";

const Modal = ({ isOpen, closeModal }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-2xl p-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-black shadow-xl rounded-2xl relative">
              <div
                className="absolute cursor-pointer top-0 right-0 m-4"
                onClick={closeModal}
              >
                <Image src={close} alt="close popup" />
              </div>
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
                    <li
                      key={point.id}
                      className="text-sm text-white flex items-center"
                    >
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
                    <li
                      key={point.id}
                      className="text-sm text-white flex items-center"
                    >
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
                    <li
                      key={point.id}
                      className="text-sm text-white flex items-center"
                    >
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
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
