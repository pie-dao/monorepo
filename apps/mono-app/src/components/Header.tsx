import { useWeb3React } from "@web3-react/core";
import logoFile from '../assets/icons/logo.png'
import WalletModal from "./Wallet/WalletModal";
import { useState } from "react";

const Web3Status = () => {
  const [show, setShow] = useState(false)
  const { active, deactivate, chainId, account } = useWeb3React();
  return (
  <div className="flex items-center justify-evenly w-1/3 flex-grow-1 basis-0">
    { show && <WalletModal setShow={setShow} />}
    { account && <p className="font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[120px]">{ account }</p>}
    { chainId && <p className="font-bold">{ chainId }</p>}
    <button className="mx-5" onClick={() => {
      active ? deactivate() : setShow(true)
    }}>
      { active ? 'Connected' : 'Connect Web3' }
    </button>
  </div>
  )
}

const Header = () => {
  return (
    <>
    <header
      className="
      border-2
      flex justify-between items-center
      fixed w-full
      top-0
      z-10
      bg-white
      "
    >
      <img src={logoFile} className="h-10 w-10 flex-grow-1 basis-0"/>
      <h1 className="hidden sm:block">Mono Vaults</h1>
      {/* <img className="block sm:hidden" alt="menu" onClick={() => setShow(true)}></img> */}
      <Web3Status />
    </header>
    </>
  )
};
export default Header;