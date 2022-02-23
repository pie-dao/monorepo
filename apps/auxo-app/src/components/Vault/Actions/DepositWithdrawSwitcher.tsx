import { Tab } from "@headlessui/react"
import { Fragment } from "react"
import { FaLock } from "react-icons/fa"
import { useIsDepositor } from "../../../hooks/useSelectedVault"
import { Vault } from "../../../store/vault/Vault"
import DepositInput from "./Deposit/DepositInput"
import MerkleVerify from "./MerkleAuthCheck"
import WithdrawInput from "./Withdraw/WithdrawInput"

const DepositWithdrawSwitcher = ({ vault }: { vault: Vault | undefined }): JSX.Element => {
    const isDepositor = useIsDepositor();
    const tabHeaders = isDepositor ? ['OPT-IN', 'DEPOSIT', 'WITHDRAW'] : ['OPT-IN'];
    return (
      <div className="w-full h-full">
      <Tab.Group defaultIndex={isDepositor ? 1 : 0} >
        <Tab.List className="flex justify-evenly items-center text-sm sm:text-base">
          {tabHeaders.map((t, i) => 
            (<Tab disabled={false} key={i} as={Fragment as any}>
              {({ selected }) => (
                <button
                  className={
                  `border-b-2 flex items-center justify-center w-full h-full py-2 font-semibold
                  ${selected
                    ? 'text-gray-600 border-baby-blue-dark border-b-[3px]'
                    : 'text-gray-300 border-gray-300'} 
                  `}
                >
                  {(!isDepositor) && <FaLock />}<p className="ml-1">{t}</p>
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="flex items-center justify-center h-[80%]">
          <Tab.Panel>
            {vault ? (<MerkleVerify vault={vault} />) : 'Connect a vault'}
            </Tab.Panel>
          <Tab.Panel className="h-full w-full">
            <DepositInput />
          </Tab.Panel>
          <Tab.Panel className="h-full w-full">
            <WithdrawInput />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      </div>
    )
  }

  export default DepositWithdrawSwitcher