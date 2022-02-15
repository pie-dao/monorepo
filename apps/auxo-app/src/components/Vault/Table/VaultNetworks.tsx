import { useWeb3React } from "@web3-react/core";
import { GiHamburgerMenu } from "react-icons/gi";
import { chainMap } from "../../../utils/networks";

const VaultTableNetworkSwitcher = () => {
    const { chainId } = useWeb3React();
    const chain = chainId && chainMap[chainId];
    return (
        <section className="
            flex
            mb-5
            w-full
            justify-center
            ">
            { chain && <div className="
                border-gray-500
                border-b-2
                w-full
                flex
                justify-between
                ">
                <div className="border-b-2 border-baby-blue-dark shadow-xl w-1/6">
                    <p className="mb-2 text-gray-700 ">{chain.name}</p>
                </div>
                <div>
                    <div className="bg-baby-blue-dark p-2 rounded-lg shadow-md mb-1">
                        <GiHamburgerMenu className="fill-white "/>
                    </div>
                </div>
            </div>}
        </section>
    )
}
export default VaultTableNetworkSwitcher;