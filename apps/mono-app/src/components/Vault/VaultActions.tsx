import { useState } from "react";
import DepositCard from "./Deposit"
import { SwitcherButton } from "../UI/button";
import WithdrawCard from "./Withdraw"

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
