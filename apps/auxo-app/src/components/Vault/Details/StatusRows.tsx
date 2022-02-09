import { useWeb3React } from "@web3-react/core";
import { IoChevronBack, IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { USDCIcon } from "../../../assets/icons/logos";
import { Vault } from "../../../store/vault/Vault";
import { getProof } from "../../../utils/merkleProof";

export const VEDoughChecker = (): JSX.Element => {
    const { account } = useWeb3React();
    const hasVedough = getProof(account);
    return (
      <div className="bg-white rounded-md p-2">
        {
        hasVedough 
          ? <div className="font-bold px-2 text-purple-700">Account is a veDOUGH holder</div>
          : <div className="font-bold px-2 text-red-700">Account is not a veDOUGH holder</div>
        }
      </div>
    )
}
  
export const VEDoughStatusRow = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-wrap items-center justify-center sm:justify-between">
          <div className="flex items-center text-purple-800">
            <button onClick={() => {navigate('/')}} className="bg-white rounded-md shadow-sm sm:shadow-md p-3">
            <IoChevronBack />
            </button>
            <div className="flex items-center mx-5 bg-white font-bold rounded-md my-5 sm:my-0 p-3 sm:p-2">
              <IoWarningOutline />
              <p className="ml-2 hidden sm:block">veDOUGH access only</p>
            </div>
          </div>
          <VEDoughChecker />
        </div>
    )
}
  
export const VaultPoolStatsRow = ({ vault }: { vault: Vault | undefined }): JSX.Element => {
    return (
        <div className="flex items-center justify-center sm:justify-between m-3">
            <div className="flex h-6 justify-start  items-center">
                <div className="h-full flex">
                <USDCIcon colors={{bg: 'purple', primary: 'white'}}/>
                </div>
                <p className="
                    ml-3 font-bold text-lg"
                    >{vault?.symbol} Pool <span className="font-extrabold text-pink-600 mr-3">{vault?.stats?.currentAPY ?? 'N/A'}% APY</span>
                </p>
            </div>
        </div>
    )
}