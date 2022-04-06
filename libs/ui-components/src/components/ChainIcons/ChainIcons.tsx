import React from "react";

export const logoSwitcher = (
  identifier: string | undefined,
  props?: any
): JSX.Element => {
  if (!identifier) return <></>;
  switch (identifier.toLowerCase()) {
    case "ftm":
    case "wftm": {
      return <FantomIcon {...props} />;
    }
    case "matic":
    case "polygon": {
      return <PolygonIcon {...props} />;
    }
    case "eth":
    default: {
      return <EthereumIcon {...props} />;
    }
  }
};

export const EthereumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
    <path
      className="fill-primary"
      d="M16 32c8.8366 0 16-7.1634 16-16 0-8.83656-7.1634-16-16-16C7.16344 0 0 7.16344 0 16c0 8.8366 7.16344 16 16 16Z"
    />
    <path className="fill-white" d="m9 16 7-12 7.5 12-7.5 4-7-4Z" />
    <path className="fill-white" d="m9 17.5 7 4 7.5-4L16 28 9 17.5Z" />
  </svg>
);

export const FantomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
    <path
      className="fill-primary"
      d="M16 32c8.8366 0 16-7.1634 16-16 0-8.83656-7.1634-16-16-16C7.16344 0 0 7.16344 0 16c0 8.8366 7.16344 16 16 16Z"
    />
    <path
      className="fill-white"
      fillRule="evenodd"
      d="m17.2001 12.4712 4.1001-2.2738v4.5476l-4.1001-2.2738Zm4.1001 9.745-5.4668 3.0318-5.4667-3.0318v-5.3056l5.4667 3.0318 5.4668-3.0318v5.3056ZM10.3667 10.1974l4.1 2.2738-4.1 2.2738v-4.5476Zm6.1501 3.3566 4.1 2.2738-4.1 2.2739V13.554Zm-1.3667 4.5477L11.05 15.8278l4.1001-2.2738v4.5477Zm5.4667-8.98713-4.7834 2.59863L11.05 9.11457l4.7834-2.70695 4.7834 2.70695ZM9 8.68146V22.8659l6.8334 3.6815 6.8335-3.6815V8.68146L15.8334 5 9 8.68146Z"
      clipRule="evenodd"
    />
  </svg>
);

export const PolygonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
    <path
      className="fill-primary"
      d="M16 32c8.8366 0 16-7.1634 16-16 0-8.83656-7.1634-16-16-16C7.16344 0 0 7.16344 0 16c0 8.8366 7.16344 16 16 16Z"
    />
    <path
      className="fill-white"
      d="M21.6874 12.5716c-.3787-.2164-.8655-.2164-1.2983 0l-3.0293 1.785-2.0556 1.136-2.9752 1.785c-.3786.2164-.8655.2164-1.2982 0l-2.32608-1.4064c-.37866-.2164-.64913-.6491-.64913-1.1359v-2.7047c0-.4327.21637-.8655.64913-1.1359l2.32608-1.35234c.3786-.21637.8655-.21637 1.2982 0l2.3261 1.40644c.3787.2163.6491.6491.6491 1.1359v1.7851l2.0556-1.1901v-1.8391c0-.4328-.2164-.8655-.6491-1.13596l-4.3276-2.54236c-.3786-.21637-.8655-.21637-1.2982 0L6.64913 9.75873C6.21638 9.9751 6 10.4078 6 10.8406v5.0847c0 .4328.21638.8655.64913 1.136l4.38167 2.5423c.3786.2164.8655.2164 1.2982 0l2.9752-1.731 2.0556-1.19 2.9752-1.731c.3787-.2163.8655-.2163 1.2983 0l2.326 1.3524c.3787.2163.6492.6491.6492 1.1359v2.7046c0 .4328-.2164.8655-.6492 1.136l-2.2719 1.3523c-.3787.2164-.8655.2164-1.2983 0l-2.3261-1.3523c-.3786-.2164-.6491-.6491-.6491-1.136v-1.7309l-2.0556 1.19v1.7851c0 .4327.2164.8655.6492 1.1359l4.3816 2.5424c.3787.2164.8655.2164 1.2983 0l4.3816-2.5424c.3787-.2163.6491-.6491.6491-1.1359v-5.1388c0-.4328-.2163-.8655-.6491-1.136l-4.3816-2.5423Z"
    />
  </svg>
);
