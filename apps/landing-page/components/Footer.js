import Image from "next/image";
import content from "../content/en_EN.json";
import piedaoLogo from "../public/piedao_logo_text.png";
import discord from "../public/social/discord_blue.svg";
import twitter from "../public/social/twitter_blue.svg";
import telegram from "../public/social/telegram_blue.svg";
import medium from "../public/social/medium_blue.svg";

const Footer = () => {
  return (
    <footer className="bg-primary px-2 py-4 flex content-around justify-center items-center text-white container mx-auto flex-col md:flex-row">
      <Image src={piedaoLogo} alt="PieDao Logo" />
      <ul className="flex items-center flex-1 ml-6 gap-x-4">
        <li>
          <a
            href={content.socials.discord.url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex"
          >
            <Image src={discord} alt="Discord" />
            <p className="ml-2">{content.socials.discord.name}</p>
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
            <p className="ml-2">{content.socials.telegram.name}</p>
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
            <p className="ml-2">{content.socials.twitter.name}</p>
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
            <p className="ml-2">{content.socials.medium.name}</p>
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
