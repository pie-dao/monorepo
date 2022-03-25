import React, { FunctionComponent, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useWeb3React } from "@web3-react/core";
import { Connect } from "./Connect";
import { useConnectedWallet } from "../hooks/use-connected-wallet";
import { useENSName } from "../hooks/use-ens-name";

const trimAccount = (account: string): string => {
  return account.slice(0, 6) + "..." + account.slice(38);
};

export const ConnectButton: FunctionComponent = () => {
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
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md bg-opacity-80 hover:bg-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          {active && account && ensName}
          {!active || (active && !account && "Connect Wallet")}
          {active && account && !ensName && trimAccount(account)}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Connect
            static
            as="div"
            open={isOpen}
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeModal}
          >
            {({ connected }) => (
              <div className="min-h-screen px-4 text-center">
                <Connect.Overlay className="fixed inset-0" />

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
                    {connected ? "connected title" : "connect title"}
                  </Connect.Title>
                  <div className="mt-4">
                    <Connect.MetamaskButton className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-900 bg-opacity-80 border border-transparent rounded-md hover:bg-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
                      {({ connecting, connected }) => (
                        <>
                          {!connected && !connecting && (
                            <span>Connect With Metamask</span>
                          )}
                          {connecting && <span>Connecting...</span>}
                          {connected && !connecting && <span>Connected</span>}
                        </>
                      )}
                    </Connect.MetamaskButton>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary bg-opacity-80 border border-transparent rounded-md hover:bg-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
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
