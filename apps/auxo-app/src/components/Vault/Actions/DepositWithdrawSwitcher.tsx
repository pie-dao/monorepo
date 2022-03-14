import { Tab } from "@headlessui/react";
import { useMemo } from "react";
import { Fragment } from "react";
import { FaLock } from "react-icons/fa";
import { useIsCorrectNetwork } from "../../../hooks/useIsCurrentNetwork";
import { useIsDepositor } from "../../../hooks/useSelectedVault";
import { Vault } from "../../../store/vault/Vault";
import { chainMap, SUPPORTED_CHAIN_ID } from "../../../utils/networks";
import DepositInput from "./Deposit/DepositInput";
import MerkleVerify from "./MerkleAuthCheck";
import WithdrawInput from "./Withdraw/WithdrawInput";

import { VscDebugDisconnect } from "react-icons/vsc";

const DepositWithdrawSwitcher = ({
  vault,
}: {
  vault: Vault | undefined;
}): JSX.Element => {
  const isDepositor = useIsDepositor();
  const correctNetwork = useIsCorrectNetwork(vault?.address);
  const tabHeaders = useMemo(
    () =>
      correctNetwork
        ? isDepositor
          ? ["DEPOSIT", "WITHDRAW"]
          : ["OPT-IN"]
        : ["DEPOSIT"],
    [correctNetwork, isDepositor]
  );
  return (
    <div className="w-full h-full">
      <Tab.Group>
        <Tab.List className="flex justify-evenly items-center text-sm sm:text-base">
          {tabHeaders.map((t) => (
            <Tab key={t} as={Fragment as any}>
              {({ selected }) => (
                <button
                  className={`border-b-2 flex items-center justify-center w-full h-full py-2 font-semibold
                    ${
                      selected
                        ? "text-gray-600 border-baby-blue-dark border-b-[3px]"
                        : "text-gray-300 border-gray-300"
                    } 
                    `}
                >
                  {!isDepositor && <FaLock />}
                  <p className="ml-1">{t}</p>
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="flex items-center justify-center h-[80%]">
          {correctNetwork ? (
            isDepositor ? (
              <>
                <Tab.Panel className="h-full w-full">
                  <DepositInput />
                </Tab.Panel>
                <Tab.Panel className="h-full w-full">
                  <WithdrawInput />
                </Tab.Panel>
              </>
            ) : (
              <Tab.Panel>
                {vault ? <MerkleVerify vault={vault} /> : "Connect a vault"}
              </Tab.Panel>
            )
          ) : (
            <Tab.Panel>
              <div className="flex flex-col items-center justify-center">
                <VscDebugDisconnect className="fill-white bg-baby-blue-dark rounded-full h-8 w-8 p-1 mb-5" />
                <p className="text-gray-600">
                  Please connect to{" "}
                  {vault
                    ? chainMap[vault.network.chainId as SUPPORTED_CHAIN_ID]
                        .chainName
                    : ""}{" "}
                  to interact with this vault
                </p>
              </div>
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default DepositWithdrawSwitcher;
