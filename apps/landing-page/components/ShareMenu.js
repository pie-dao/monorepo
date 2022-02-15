import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import content from "../content/en_EN.json";
import shareIcon from "../public/share.svg";
import styles from "../styles/ShareMenu.module.scss";

const ShareMenu = () => {
  const url = typeof window !== "undefined" ? window.location.origin : "";
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
        <Menu.Items className="absolute p-3 flex flex-col items-center w-10 justify-center mt-6 left-0 right-0 origin-top-right bg-white divide-y divide-gray-100 rounded-md ring-2 ring-highlight_secondary focus:outline-none">
          <Menu.Item>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                content.socials.twitter.share
              )}&url=${encodeURIComponent(url)}`}
              className={`mb-1 ${styles.shareButton}`}
              target="_blank"
              rel="noreferrer noopener"
              data-ga="share-social-twitter"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26 7.12926c-.8622.3657-1.7764.60526-2.7121.71077.9864-.5663 1.7255-1.45862 2.0796-2.51077-.9287.52594-1.9427.8973-2.9996 1.09846-.712-.72685-1.6526-1.20775-2.6765-1.36847-1.024-.16072-2.0744.00767-2.9892.47919-.9147.47152-1.6428 1.21994-2.072 2.12973-.4292.90979-.5356 1.93036-.3027 2.90413-1.8758-.091-3.7109-.5603-5.38648-1.37762-1.67559-.8173-3.15436-1.96437-4.3406-3.36696-.60242.99998-.78711 2.18333-.51656 3.30972.27055 1.12636.97605 2.11136 1.97322 2.75486-.73635-.0227-1.45621-.2158-2.09875-.563-.01477 1.0539.35074 2.0801 1.03414 2.9034.6834.8232 1.64229 1.3924 2.71295 1.6104-.69374.1825-1.42193.2078-2.1275.0739.30023.9038.88689 1.6944 1.67757 2.2606.79068.5663 1.74565.8797 2.73076.8963C8.00222 20.5542 5.49052 21.2179 3 20.92c2.158 1.336 4.67014 2.0443 7.2354 2.04 1.8179.0124 3.6192-.3332 5.2934-1.0156 1.6742-.6824 3.1859-1.6872 4.4423-2.9528 1.2565-1.2655 2.2311-2.765 2.8641-4.4065.633-1.6415.911-3.3902.8169-5.13892.9169-.6345 1.7115-1.41863 2.3479-2.31692Z"
                  fill="#9388DB"
                />
              </svg>
            </a>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() =>
                window.open(
                  `${content.socials.facebook.url}${encodeURIComponent(url)}`,
                  "_blank",
                  "width=600,height=600"
                )
              }
              className={`mb-1 ${styles.shareButton}`}
              target="_blank"
              rel="noreferrer noopener"
              data-ga="share-social-twitter"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4v4h-2c-.69 0-1 .81-1 1.5V12h3v4h-3v8h-4v-8H9v-4h3V8c0-1.06087.4214-2.07828 1.1716-2.82843C13.9217 4.42143 14.9391 4 16 4h3Z"
                  fill="#9388DB"
                />
              </svg>
            </button>
          </Menu.Item>
          <Menu.Item>
            <a
              href={`https://t.me/share/url?url=${url}&text=${encodeURI(
                content.socials.telegram.share
              )}`}
              target="_blank"
              rel="noreferrer noopener"
              className={`${styles.shareButton}`}
              data-ga="share-social-facebook"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m11.2764 21.911.3418-5.0343 9.3744-8.23595c.415-.36894-.0855-.54747-.6348-.22613L8.78633 15.5437l-5.00456-1.5472c-1.07414-.2976-1.08635-1.0236.24413-1.5472l19.4934-7.33142c.891-.39275 1.7454.21423 1.4037 1.54721L21.6029 21.911c-.2319 1.0831-.9033 1.3449-1.831.845l-5.0533-3.6419-2.4291 2.2971c-.2807.2737-.5126.4998-1.0131.4998Z"
                  fill="#9388DB"
                />
              </svg>
            </a>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ShareMenu;
