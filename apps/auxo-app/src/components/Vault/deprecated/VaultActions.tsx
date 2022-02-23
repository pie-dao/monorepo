import { useState } from "react";
import { DepositInput } from "./Deposit"
import { SwitcherButton } from "../../UI/button";
import { WithdrawInput, WithdrawStatusBar } from "./Withdraw"
import { useSelectedVault } from "../../../hooks/useSelectedVault";
import MerkleVerify from "../Actions/MerkleAuthCheck";
import CardItem from "../../UI/cardItem";
import { prettyNumber } from "../../../utils";
import { useStatus } from "../../../hooks/useWithdrawalStatus";

function DepositCard({ loading }: { loading: boolean }) {
  const vault = useSelectedVault();
  const loadingDepositor = vault?.auth.address;
  if (!vault) return <p>Failed to Load</p> 
  return (
    <section className="flex flex-col justify-evenly h-full items-center">
      <h1 className="text-3xl">Deposit {vault.name}</h1>
      <CardItem
          loading={loading}
          left="Vault Network"
          right={ vault.network.name }
      />
      <CardItem
          loading={loading}
          left={`Your ${vault.symbol} Wallet balance`}
          right={ prettyNumber(vault?.userBalances?.wallet.label) }
      />
      <CardItem
          loading={loading}
          left={`Your Vault Token balance`}
          right={ prettyNumber(vault?.userBalances?.vault.label) }
      />
      { loadingDepositor ? <div>LOADING...</div> :
        vault.auth.isDepositor ? <DepositInput vault={vault} /> : <MerkleVerify vault={vault}/>}
    </section>     
  )
}

const WithdrawCard = ({ loading }: { loading: boolean }) => {
  const vault = useSelectedVault();
  const status = useStatus();
  if (!vault) return <p>Failed to Load</p> 
  return (
    <section className="flex flex-col justify-evenly h-full items-center">
      <h1 className="text-3xl">Withdraw {vault.name}</h1>
      <CardItem
          loading={loading}
          left="Vault Network:"
          right={ vault.network.name }
      />
      <CardItem
          loading={loading}
          left={`Your ${vault.symbol} Wallet balance:`}
          right={ prettyNumber(vault?.userBalances?.wallet.label) }
      />
      <CardItem
          loading={loading}
          left={`Your Vault Token balance:`}
          right={ prettyNumber(vault?.userBalances?.vault.label) }
      />
      <CardItem
          loading={loading}
          left={`Batch Burn Round:`}
          right={ prettyNumber(vault?.stats?.batchBurnRound) }
      />
      <CardItem
          loading={loading}
          left={`Your Batch Burn Round:`}
          right={ prettyNumber(vault?.userBalances?.batchBurn.round) }
      />            
      <CardItem
          loading={loading}
          left={`Shares Pending Withdrawal:`}
          right={ prettyNumber(vault?.userBalances?.batchBurn.shares.label ?? 0) }
      />      
      <CardItem
          loading={loading}
          left={`Available to withdraw:`}
          right={ prettyNumber(vault?.userBalances?.batchBurn.available.label ?? 0 ) }
      />
      <WithdrawStatusBar status={status} />
      <WithdrawInput vault={vault} status={status}/>
    </section>
  )
}

function VaultActions({ loading }: { loading: boolean }) {
  const [depositMode, setDepositMode] = useState(true);
  return (
    <div 
      id="vault-actions" 
      className="component-spacer h-screen w-screen flex justify-center items-center">
      <section
        className="
          h-1/2
          w-1/2
          shadow-lg
          flex
          flex-col
          p-5
          border-2
          rounded-lg
        "
        >
      <section
        className="w-full"
      >
        <SwitcherButton
          disabled={depositMode}
          onClick={() => setDepositMode(true)}
        >
          Deposit
        </SwitcherButton>
        <SwitcherButton
          disabled={!depositMode}
          onClick={() => setDepositMode(false)}
        >
          Withdraw
        </SwitcherButton>
      </section>
      { 
        depositMode 
          ? <DepositCard  loading={loading} />
          : <WithdrawCard loading={loading}/>
      }
      </section>
    </div>
  )
}

export default VaultActions
