import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import Modal from "./Modal";
import content from "../content/en_EN.json";
import piedaoLogo from "../public/piedao_logo_text.png";
import discord from "../public/social/discord_blue.svg";
import twitter from "../public/social/twitter_blue.svg";
import telegram from "../public/social/telegram_blue.svg";
import medium from "../public/social/medium_blue.svg";

const ModalCookie = () => {
  return (
    <>
      <Dialog.Title
        as="h3"
        className="text-2xl mb-4 leading-6 text-highlight font-bold uppercase"
      >
        {content.cookie_modal.title}
      </Dialog.Title>
      <div className="mt-4text-sm text-white">
        <p>{content.cookie_modal.description}</p>
      </div>
    </>
  );
};

const ModalTerms = () => {
  return (
    <>
      <Dialog.Title
        as="h3"
        className="text-2xl mb-4 leading-6 text-highlight font-bold uppercase"
      >
        {content.terms_modal.title}
      </Dialog.Title>
      <div className="mt-4 text-sm text-white">
        <p>{content.terms_modal.description}</p>
      </div>
    </>
  );
};

const Footer = ({ margin }) => {
  const [modalToOpen, setModalToOpen] = useState("");

  const closeModal = () => {
    setModalToOpen("");
  };

  return (
    <footer
      className={`bg-primary px-6 py-4 flex content-around justify-center items-center text-white container mx-auto flex-col md:flex-row ${margin}`}
    >
      <a
        href="https://www.piedao.org"
        target="_blank"
        rel="noreferrer noopener"
        className="flex mb-6 md:mb-0"
      >
        <Image src={piedaoLogo} alt="PieDao Logo" />
      </a>
      <ul className="flex items-center flex-1 md:ml-6 mb-6 md:mb-0 gap-6">
        <li>
          <a
            href={content.socials.discord.url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex"
          >
            <Image src={discord} alt="Discord" />
            <p className="ml-2 hidden md:flex">
              {content.socials.discord.name}
            </p>
          </a>
        </li>
        <li>
          <a
            href={content.socials.telegram.url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex"
          >
            <Image src={telegram} alt="Telegram" />
            <p className="ml-2 hidden md:flex">
              {content.socials.telegram.name}
            </p>
          </a>
        </li>
        <li>
          <a
            href={content.socials.twitter.url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex"
          >
            <Image src={twitter} alt="Twitter" />
            <p className="ml-2 hidden md:flex">
              {content.socials.twitter.name}
            </p>
          </a>
        </li>
        <li>
          <a
            href={content.socials.medium.url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex"
          >
            <Image src={medium} alt="Medium" />
            <p className="ml-2 hidden md:flex">{content.socials.medium.name}</p>
          </a>
        </li>
      </ul>
      <div className="flex items-center gap-x-4 text-sm">
        <button
          type="button"
          onClick={() => setModalToOpen("cookies")}
          className="flex"
        >
          Cookies
        </button>
        <button
          type="button"
          onClick={() => setModalToOpen("terms")}
          className="flex"
        >
          Terms & Conditions
        </button>
      </div>
      <Modal isOpen={modalToOpen === "cookies"} closeModal={closeModal}>
        <ModalCookie />
      </Modal>
      <Modal isOpen={modalToOpen === "terms"} closeModal={closeModal}>
        <ModalTerms />
      </Modal>
    </footer>
  );
};

export default Footer;
