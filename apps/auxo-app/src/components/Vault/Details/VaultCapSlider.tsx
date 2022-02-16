import { useSelectedVault } from "../../../hooks/useSelectedVault"
import { prettyNumber } from "../../../utils";

const VaultCapSlider = () => {
    const vault = useSelectedVault()
    const deposits = vault?.userBalances?.vaultUnderlying
    const cap = vault?.cap.underlying;
    const currency = vault?.symbol;
    const pendingWithdrawal = vault?.userBalances?.batchBurn.shares
    const barWidth = () => {
        if (deposits && cap && pendingWithdrawal) {
            const pc = Math.round((deposits.label + pendingWithdrawal?.label) / cap.label * 100);
            return pc + '%';    
        }
    }
    return (
        <div className="flex flex-col w-full text-baby-blue-dark text-xs sm:text-sm font-bold mb-3 sm:mb-2 px-1 sm:px-0">
            <div className="flex w-full justify-between px-1 mb-1 sm:mb-0">
                <p>{ prettyNumber(deposits?.label) } { currency }</p>
                <p><span className="hidden sm:inline-block">MAX:</span> { prettyNumber(cap?.label) } { currency }</p>
            </div>
            <div className="w-full px-1 rounded-xl h-2 sm:h-4 flex items-center bg-white">
                <div className="h-1 sm:h-2 rounded-xl
                    bg-gradient-to-r from-return-0 via-return-60 to-return-100
                   "
                   // cannot use string concat with arbitrary tailwind values
                   style={{ width: barWidth()}}
                   ></div>
            </div>
        </div>
    )
}

export default VaultCapSlider