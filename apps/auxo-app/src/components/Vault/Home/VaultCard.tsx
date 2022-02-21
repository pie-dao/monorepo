import { useAppSelector } from "../../../hooks";
import { useApy } from "../../../hooks/useApy";
import { useNavigateToVault } from "../../../hooks/useSelectedVault";
import { Vault } from "../../../store/vault/Vault";
import { prettyNumber } from "../../../utils";
import { logoSwitcher } from "../../../utils/logos";
import StyledButton from "../../UI/button";
import { Divider } from "../../UI/divider";

const VaultCardActions: React.FC<{ addr: string }> = ({ addr }) => {
    const selectVault = useNavigateToVault()
    return (
        <section className="w-full relative">
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                <StyledButton 
                    onClick={() => selectVault(addr)}
                    className="hover:bg-white">
                        DEPOSIT
                </StyledButton>
            </span>
        </section>
    )
}

const VaultCardHeader: React.FC<{ vault: Vault }> = ({ vault }) => {
    const message = useApy(vault);
    return (
        <section className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex items-center">
                <div className="h-8 w-8 mr-2">
                    { logoSwitcher(vault.symbol) }
                </div>
                <p className="font-bold text-return-100">{vault.symbol}</p>
            </div>
            <div>
                <p className="text-return-100 font-bold">{'APY: ' + message}</p>
            </div>
        </section>
    )
}

const VaultCardContent: React.FC<{ vault: Vault }> = ({ vault }) => {
    return (
        <section className="w-full p-2 px-5 flex flex-col justify-evenly h-full">
        <div className="
            flex w-full justify-between 
            text-gray-700
        "> 
            <p>Total Deposits</p>
            <p>{prettyNumber(vault.stats?.deposits.label) ?? '--'}</p>
        </div>
        
        <div className="
            flex w-full justify-between 
            text-gray-700
        ">
            <p>My Deposits</p>
            <p>{prettyNumber(vault.userBalances?.vaultUnderlying.label) ?? '--'}</p>
        </div>
    </section>
    )
}


const VaultCard: React.FC<{ vault: Vault }> = ({ vault }) => {
    const selectVault = useNavigateToVault();
    return (
        <div 
            onClick={() => selectVault(vault.address)}
            className="
            hover:border-gradient p-[2px] bg-white shadow-md rounded-lg h-48 
            flex flex-col items-center justify-between cursor-pointer
            ">
            <VaultCardHeader vault={vault} />
            <Divider />
            <VaultCardContent vault={vault} />
            <Divider className="mb-8"/>
            <VaultCardActions addr={vault.address}/>
        </div>
    )
}

const VaultCardView = () => {
    const vaults = useAppSelector(state => state.vault.vaults);
    return (
        <div
            className="
                px-5 
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                gap-8 md:gap-6
            "
        >{
            vaults.map((v, i) => (<VaultCard key={i} vault={v} />))
        }</div>
    )
}

export default VaultCardView