import { useWeb3React } from "@web3-react/core";
import { chainMap } from "../../utils/networks";

const VaultNetworks = () => {
    const { chainId } = useWeb3React();
    const chain = chainId && chainMap[chainId];
    return (
        <section className="
            flex
            mb-5
            w-full
            px-10 
            justify-center
            ">
            { chain && <div className="
                border-black
                border-b-[1px]
                w-full
                flex
                justify-start
                ">
                <div className="border-b-2 border-purple-500 w-1/6">
                    <p className="mb-2 text-purple-700 font-bold">{chain.name}</p>
                </div>
            </div>}
        </section>
    )
}
export default VaultNetworks;