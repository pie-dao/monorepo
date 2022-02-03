import { Menu } from "@headlessui/react";
import Image from "next/image";
import discord from "../public/social/discord.svg";
import facebook from "../public/social/facebook.svg";
import twitter from "../public/social/twitter.svg";
import telegram from "../public/social/telegram.svg";
import shareIcon from "../public/share.svg";

const ShareMenu = () => {
  return (
    <Menu as="div">
      <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        <Image src={shareIcon} alt="share" />
      </Menu.Button>
      <Menu.Items static>
        <Menu.Item>
          <a href="#">
            <Image src={twitter} alt="Share on Twitter" />
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="#">
            <Image src={facebook} alt="Share on Facebook" />
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="#">
            <Image src={discord} alt="Visit our Discord" />
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="#">
            <Image src={telegram} alt="Share on Telegram" />
          </a>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default ShareMenu;
