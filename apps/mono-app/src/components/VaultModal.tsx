import React, { ReactNode } from "react";
import { DAIIcon, USDCIcon } from "../assets/icons/logos";
import logoFile from '../assets/icons/logo.png'
import { Vault } from "../store/vault/Vault";
import { prettyNumber } from "../utils";
import { useAppDispatch } from "../hooks";
import { setSelectedVault } from "../store/vault/vault.slice";

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
  switch (name.toLowerCase()) {
    case 'usdc': {
      return (<USDCIcon colors={{ primary: '#a50bce', bg: 'white' }}/>)
    }
    case 'dai': {
      return (<DAIIcon colors={{ bg: 'orange', primary: 'white' }}/>)
    }
    default: {
      return (<img src={logoFile} />)
    }
  } 

} 

const VaultModal = ({ vault }: { vault: Vault }): JSX.Element => {
  const dispatch = useAppDispatch();
  return (
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
    <div className="absolute right-3 top-3">
      <p className={`text-sm p-1 text-white rounded-lg font-extrabold
        ${vault.network.name.toUpperCase() === 'POLYGON' ? ' text-purple-700' : 'text-red-700'} `}
      >{vault.network.name}</p>
    </div>
    <h2 className="text-center text-lg italic m-5">{vault.name}</h2>
    <p className="text-left mx-5">{vault.description}</p>
    <div className="flex justify-between px-5">
      <p className="text-left">Deposits:</p>
      <p>${prettyNumber(vault.stats?.deposits.label ?? 0)}</p>
    </div>
    <div className="flex justify-between px-5">
      <p className="text-left">Last Harvest:</p>
      <p>{vault.stats?.lastHarvest ?? 'N/A'}</p>
    </div>    
    <Divider />
    <section className="card-actions flex justify-between items-center px-5 w-full">
      <div className="details">
        <p>Current APY: <span className="font-bold text-green-600">{vault.stats && vault.stats.currentAPY} %</span></p>
      </div> 

      <button
        className="
          bg-purple-400 font-bold
          border-purple-400
          text-white
          hover:text-purple-400
          border-2
          hover:bg-transparent 
          rounded-md
          px-2 py-1 
          my-1
          text-center
          min-w-[120px]
          "
        onClick={() => {
          dispatch(setSelectedVault(vault.address))
        }}
      >
        Deposit
      </button>
      {/* <button
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
      </button> */}
    </section>
  </div>
  </CardBorderGradient>  
)};

export default VaultModal;