import React, { ReactHTMLElement, ReactNode, ReactPropTypes } from "react";
import { USDCIcon } from "../assets/icons/logos";
import { Vault } from "../store/vault/vaultSlice";
import { scrollTo } from "../utils/scroll";
import { Logo } from '@piedao/ui-atoms'

const CardBorderGradient = ({ children }: React.HTMLProps<HTMLDivElement> & { children: ReactNode }) => {
  return (
    <div
      className="
      border-gradient
      w-[300px] sm:w-1/3
      h-[300px]
      m-5
      "
    >
      { children }
    </div>
  )  
}

const CardIcon = ({ children }: { children: ReactNode }) => (
  <div className="absolute top-3 left-3 h-20 w-20 flip">
    { children }
 </div>
)

const Divider = ({ props }: { props?: React.HTMLProps<HTMLDivElement> }) => (
  <div
    className="h-[1px] bg-gray-200 mx-5"
    { ...props }
  />
)

const fetchIcon = (name: string): ReactNode => {
  console.debug({ Logo })
  switch (name.toLowerCase()) {
    case 'usdc': {
      return (<USDCIcon colors={{ primary: '#a50bce', bg: 'white' }}/>)
    }
    default: {
      return (<Logo size="sm" />)
    }
  } 

} 

const VaultModal = ({ vault, loading }: { vault: Vault, loading: boolean }): JSX.Element => (
  <CardBorderGradient
    className="w-screen"
  >
  <div
    className="
    flex flex-col justify-evenly 
    relative
    w-full
    h-full
    "
  >
    <CardIcon>
      { fetchIcon(vault.name) }
    </CardIcon>

    <h2 className="text-center text-lg italic m-5">{vault.name}</h2>
    <p>{vault.description}</p>
    { 
      loading 
        ? <p>Loading...</p>
        : vault.stats && 
        <div className="details">
          <p>Projected APY: {vault.stats.projectedAPY} %</p>
        </div> 
    }
    <Divider />
    <section className="card-actions">
      <button
        className="
          bg-blue-500 border-2 border-blue-500
          hover:bg-transparent 
          rounded-md
          px-2 py-1 mx-1
          my-1
          min-w-[120px]
          "
        onClick={() => scrollTo('vault-extended', -1000)}
      >
        Deposit
      </button>
      <button
        className="
          border-blue-500 border-2 hover:bg-blue-500
          rounded-md 
          py-1 px-2 mx-1
          my-1
          min-w-[120px]
          "
        onClick={() => scrollTo('vault-extended', -1000)}
      >
        Withdraw
      </button>
    </section>
  </div>
  </CardBorderGradient>  
);

export default VaultModal;