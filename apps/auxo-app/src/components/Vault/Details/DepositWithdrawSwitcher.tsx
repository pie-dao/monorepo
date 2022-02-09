import { Tab } from "@headlessui/react"
import { useWeb3React } from "@web3-react/core"
import { Fragment } from "react"
import { FaLock } from "react-icons/fa"
import { Vault } from "../../../store/vault/Vault"
import { getProof } from "../../../utils/merkleProof"
import { DepositInput } from "../Deposit"
import MerkleVerify from "../MerkleAuthCheck"
import { useStatus, WithdrawInput, WithdrawStatusBar } from "../Withdraw"

const DepositWithdrawSwitcher = ({ vault }: { vault: Vault | undefined }): JSX.Element => {
    const { account } = useWeb3React();
    const status = useStatus();
    const hasVedough = getProof(account);
    const tabHeaders = hasVedough ? ['OPT-IN', 'DEPOSIT', 'WITHDRAW'] : ['OPT-IN'];
    const isDepositor = vault?.auth.isDepositor;
    return (
      <div className="w-full h-full">
      <Tab.Group>
        <Tab.List className="flex justify-evenly items-center">
          {tabHeaders.map((t, i) => 
            (<Tab disabled={isDepositor} key={i} as={Fragment as any}>
              {({ selected }) => (
                <button
                  className={
                  `border-b-2 flex items-center justify-center w-full h-full py-2 font-semibold
                  ${selected
                    ? 'text-black border-purple-700'
                    : 'text-gray-300 border-gray-300'} 
                  `}
                >
                  {(!hasVedough || !isDepositor) && <FaLock />}<p className="ml-1">{t}</p>
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
            {vault ? <DepositInput vault={vault} /> : 'Connect a vault'}
          </Tab.Panel>
          <Tab.Panel className="h-full w-full">
            {vault ? 
            <>
              <WithdrawStatusBar status={status} />
              <WithdrawInput vault={vault} status={status} />
            </>
            : 'Connect a vault'}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      </div>
    )
  }

  export default DepositWithdrawSwitcher