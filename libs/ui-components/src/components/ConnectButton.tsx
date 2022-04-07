import React, { FunctionComponent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWeb3React } from "@web3-react/core";
import { Connect } from "./Connect";
import Icon from "../ui-atoms/Icon";
import { useConnectedWallet } from "../hooks/use-connected-wallet";
import { useENSName } from "../hooks/use-ens-name";
import { MetamaskIcon, WalletConnectIcon } from "../shared/external-icons";
import { classNames } from "../utils/class-names";

interface Props {
  className?: string;
}

const trimAccount = (account: string): string => {
  return account.slice(0, 6) + "..." + account.slice(38);
};

export const ConnectButton: FunctionComponent<Props> = ({ className }) => {
  useConnectedWallet();
  const { account, active, library } = useWeb3React();
  const ensName = useENSName(library, account);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={classNames(
          "px-4 py-2 text-md font-medium text-white bg-primary rounded-lg border-2 border-current hover:bg-transparent hover:text-primary",
          className
        )}
      >
        {active && account && ensName}
        {!account && "Connect Wallet"}
        {active && account && !ensName && trimAccount(account)}
      </button>

      <AnimatePresence>
        {isOpen && (
          <Connect
            static
            as="div"
            open={isOpen}
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeModal}
          >
            {({ connected, connecting, waiting }) => (
              <div className="min-h-screen px-4 text-center">
                <Connect.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                  className="inline-block h-screen align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Connect.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {!connected && !connecting && !waiting && "Connect Wallet"}
                    {connected && !connecting && "Account"}
                    {(waiting || connecting) &&
                      "Awaiting confirmation from your wallet..."}
                  </Connect.Title>
                  <button
                    className="absolute top-5 right-5"
                    onClick={closeModal}
                  >
                    <Icon className="fill-primary" icon="close" />
                  </button>
                  <div className="mt-4 flex flex-col gap-y-3">
                    {!connected && !connecting && !waiting && (
                      <>
                        <Connect.MetamaskButton className="flex items-center px-4 py-2 text-sm font-medium border text-left border-transparent rounded-md hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
                          <>
                            <MetamaskIcon className="h-10 w-10 mr-4" />
                            {!connected && <span>Connect With Metamask</span>}
                            {connecting && <span>Connecting...</span>}
                          </>
                        </Connect.MetamaskButton>
                        <Connect.WalletConnectButton className="flex items-center px-4 py-2 text-sm font-medium text-left border border-transparent rounded-md hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
                          <>
                            <WalletConnectIcon className="h-10 w-10 mr-4" />
                            {!connected && (
                              <span>Connect With Wallet Connect</span>
                            )}
                          </>
                        </Connect.WalletConnectButton>
                      </>
                    )}
                    {(waiting || connecting) && (
                      <div className="flex items-center justify-center h-20">
                        <Rotate />
                      </div>
                    )}
                    {connected && account && (
                      <div className="flex px-2 py-4 border rounded-md border-primary justify-between">
                        <div>
                          <p className="text-md font-medium">
                            {trimAccount(account)}
                          </p>
                        </div>
                        <Connect.DisconnectButton className="px-2 py-1 text-xs font-medium text-white bg-primary rounded-md bg-opacity-80 hover:bg-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                          Disconnect
                        </Connect.DisconnectButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Connect>
        )}
      </AnimatePresence>
    </>
  );
};

export const Rotate = () => (
  <motion.div
    className="w-8 h-8 bg-primary"
    animate={{
      scale: [1, 2, 2, 1, 1],
      rotate: [0, 0, 270, 270, 0],
      borderRadius: ["20%", "20%", "50%", "50%", "20%"],
    }}
    transition={{
      duration: 2,
      ease: "easeInOut",
      times: [0, 0.2, 0.5, 0.8, 1],
      repeat: Infinity,
      repeatDelay: 1,
    }}
  />
);
