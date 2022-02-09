import Image from "next/image";
import piedaoLogo from "../public/piedao_logo_text.png";
import discord from "../public/social/discord_blue.svg";
import twitter from "../public/social/twitter_blue.svg";
import telegram from "../public/social/telegram_blue.svg";
import medium from "../public/social/medium_blue.svg";

const Footer = () => {
  return (
    <footer className="bg-primary p-6 flex content-around justify-center items-center text-white container mx-auto">
      <Image src={piedaoLogo} alt="PieDao Logo" />
      <ul className="flex items-center flex-1 ml-6 gap-x-4">
        <li>
          <a href="#" className="flex">
            <Image src={discord} alt="Visit our discord" />
            <p className="ml-2">Discord</p>
          </a>
        </li>
        <li>
          <a href="#" className="flex">
            <Image src={telegram} alt="Share on Telegram" />
            <p className="ml-2">Telegram</p>
          </a>
        </li>
        <li>
          <a href="#" className="flex">
            <Image src={twitter} alt="Share on Twitter" />
            <p className="ml-2">Twitter</p>
          </a>
        </li>
        <li>
          <a href="#" className="flex">
            <Image src={medium} alt="Share on Medium" />
            <p className="ml-2">Medium</p>
          </a>
        </li>
      </ul>
      <div className="flex items-center gap-x-4 text-sm">
        <a href="#" className="flex">
          Cookies
        </a>
        <a href="#" className="flex">
          Terms & Conditions
        </a>
      </div>
    </footer>
  );
};

export default Footer;
