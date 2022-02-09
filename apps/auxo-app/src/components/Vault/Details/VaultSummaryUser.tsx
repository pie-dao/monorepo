import { Vault } from "../../../store/vault/Vault"
import { prettyNumber } from "../../../utils"
import CardItem from "../../UI/cardItem"

const VaultSummaryUser = ({ loading, vault }: {
    loading: boolean,
    vault: Vault | undefined
  }) => {
    if (!vault) return <p>Failed to Load</p> 
    return (
      <section className="
        flex flex-col w-full justify-evenly h-full items-center">
        <CardItem
            loading={loading}
            left={`Your Vault Token balance`}
            right={ prettyNumber(vault?.userBalances?.vault.label) }
        />
        <CardItem
            loading={loading}
            left="Last Harvested"
            right={ vault.stats?.lastHarvest.toString() ?? 'N/A' }
        />
        <div className="
          h-[1px] bg-gray-300 w-full "/>
        <CardItem
            loading={loading}
            left={`Your ${vault.symbol} Wallet balance`}
            right={ prettyNumber(vault?.userBalances?.wallet.label) }
        />
         <CardItem
            loading={loading}
            left={`Available to withdraw:`}
            right={ prettyNumber(vault?.userBalances?.batchBurn.available.label ?? 0 ) }
        />
      </section>     
    )
  }

  export default VaultSummaryUser