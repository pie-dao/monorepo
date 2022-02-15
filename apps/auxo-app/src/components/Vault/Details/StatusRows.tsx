import { useWeb3React } from "@web3-react/core";
import { IoChevronBack, IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { USDCIcon } from "../../../assets/icons/logos";
import { Vault } from "../../../store/vault/Vault";
import { getProof } from "../../../utils/merkleProof";
import VaultCapSlider from "./VaultCapSlider";

export const VEDoughChecker = (): JSX.Element => {
    const { account } = useWeb3React();
    const hasVedough = getProof(account);
    return (
      <div className="bg-white rounded-md p-2">
        {
        hasVedough 
          ? <div className="font-bold px-2 text-baby-blue-dark">Account is a veDOUGH holder</div>
          : <div className="font-bold px-2 text-return-100">Account is not a veDOUGH holder</div>
        }
      </div>
    )
}
  
export const VEDoughStatusRow = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-wrap items-center justify-center sm:justify-between">
          <div className="flex items-center text-baby-blue-dark">
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
  
export const FloatingBackground = (): JSX.Element => {
  return (
    <div className="relative pt-1 mt-5 z-20 w-full">
      <div className="bg-baby-blue-light rounded-xl h-48 w-full absolute top-0 -z-20" />
      <div className="flex items-center justify-between w-full sm:justify-between m-3">
      </div>
    </div>
  )
}

export const VaultPoolAPY = ({ vault }: { vault: Vault | undefined }) => (
  <div className="flex h-6 justify-start mb-5 items-center">
    <div className="h-8 w-8 flex ml-3">
      <USDCIcon />
    </div>
    <p className="ml-3 font-bold text-2xl text-gray-700"
        >{vault?.symbol} pool <span className="font-extrabold text-return-100 mr-3">{vault?.stats?.currentAPY ?? 'N/A'}% APY</span>
    </p>
  </div>
)