import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import discord from "../public/social/discord.svg";
import facebook from "../public/social/facebook.svg";
import twitter from "../public/social/twitter.svg";
import telegram from "../public/social/telegram.svg";
import shareIcon from "../public/share.svg";

const ShareMenu = () => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex justify-center w-full p-2 text-sm font-medium text-white bg-black rounded-lg bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        <Image src={shareIcon} alt="share" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute p-3 flex flex-col items-center w-10 justify-center mt-2 left-0 right-0 origin-top-right bg-white divide-y divide-gray-100 rounded-md ring-4 ring-highlight_secondary focus:outline-none">
          <Menu.Item>
            <a href="#" className="w-[20px] h-[20px] mb-4">
              <Image src={twitter} alt="Share on Twitter" />
            </a>
          </Menu.Item>
          <Menu.Item>
            <a href="#" className="w-[20px] h-[20px] mb-4">
              <Image
                src={facebook}
                alt="Share on Facebook"
                width={20}
                className="mx-auto"
              />
            </a>
          </Menu.Item>
          <Menu.Item>
            <a href="#" className="w-[20px] h-[20px] mb-4">
              <Image src={discord} alt="Visit our Discord" />
            </a>
          </Menu.Item>
          <Menu.Item>
            <a href="#" className="w-[20px] h-[20px]">
              <Image src={telegram} alt="Share on Telegram" />
            </a>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ShareMenu;
