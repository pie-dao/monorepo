import { Menu, Transition } from "@headlessui/react";
import { useWeb3React } from "@web3-react/core";
import { Fragment, ReactNode } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { useWeb3Cache } from "../../hooks/useCachedWeb3";
import { LibraryProvider } from "../../types/utilities";
import { logoSwitcher } from "../../utils/logos";
import { changeNetwork, NetworkDetail } from "../../utils/networks";

import {
  chainMap,
  isChainSupported,
  SUPPORTED_CHAIN_ID,
} from "../../utils/networks";

export const ChainAndLogo = ({ chain }: { chain: NetworkDetail | null }) => (
  <div className="flex items-center">
    <div className="w-6 h-6 mr-2">
      {logoSwitcher(chain?.nativeCurrency?.symbol)}
    </div>
    <p className="pt-1">{chain ? chain.chainName : "Unsupported Chain"}</p>
  </div>
);

const MenuTransition = (props: { children: ReactNode }) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    {props.children}
  </Transition>
);

export const ChainMenuItem = ({
  chain,
  chainId,
  id,
}: {
  chain: NetworkDetail | null;
  chainId: number | undefined;
  id: string;
}) => (
  <Menu.Item>
    {({ active }) => (
      <button
        onClick={() => changeNetwork({ chainId: Number(id) })}
        className={`${
          active ? "bg-baby-blue-light text-baby-blue-dark" : "text-gray-900"
        } group flex justify-between rounded-md items-center w-full px-2 py-2 text-sm`}
      >
        <ChainAndLogo chain={chain} />
        {chainId === Number(id) && <FaCheck className="fill-baby-blue-dark" />}
      </button>
    )}
  </Menu.Item>
);

export default function NetworkSwitcher() {
  const { chainId } = useWeb3Cache();
  const { account } = useWeb3React<LibraryProvider>();
  const chain = isChainSupported(chainId)
    ? chainMap[chainId as SUPPORTED_CHAIN_ID]
    : null;
  return (
    <div className="w-56 text-right z-20">
      <Menu as="div" className="text-left">
        <div>
          <Menu.Button
            className="inline-flex items-center justify-between w-full px-3 py-2 
                        shadow-md 
                        text-sm font-medium text-baby-blue-dark bg-white rounded-md"
            disabled={!account}
          >
            <ChainAndLogo chain={chain} />
            {account && (
              <FaChevronDown
                className="w-4 h-4 ml-2 flex  text-baby-blue-dark"
                aria-hidden="true"
              />
            )}
          </Menu.Button>
        </div>
        <MenuTransition>
          <Menu.Items
            className="
                            absolute w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 
                            rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                        "
          >
            <div className="px-1 py-1">
              {Object.entries(chainMap).map(([id, chain]) => (
                <ChainMenuItem
                  key={id}
                  chain={chain}
                  id={id}
                  chainId={chainId}
                />
              ))}
            </div>
          </Menu.Items>
        </MenuTransition>
      </Menu>
    </div>
  );
}
