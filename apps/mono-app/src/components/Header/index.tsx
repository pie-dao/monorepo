import { useWeb3React } from "@web3-react/core";
import logoFile from '../../assets/icons/logo.png'
import WalletModal from "./WalletModal";
import { useEffect, useState } from "react";
import { chainMap } from "../../utils/networks";
import ErrorMessage from "./ErrorMessage";
import { useAppSelector } from "../../hooks";
import { useWeb3Cache } from "../../hooks/useCachedWeb3";
import { useEagerConnect, useInactiveListener } from "../../hooks/useWeb3";
import { network } from "../../connectors";

const trimAccount = (account: string): string => {
  return account.slice(0, 6) + '...' + account.slice(38)
}

const useFallBack = () => {
  const { active, activate } = useWeb3React()
  const { chainId } = useWeb3Cache();
  useEffect(() => {
    if (!active) activate(network)
  }, [active, chainId])
}

const useConnectedWallet = () => {
  const { connector } = useWeb3React();
  const [activatingConnector, setActivatingConnector] = useState<any>()
  const triedEager = useEagerConnect()

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  useFallBack();

  useInactiveListener(!triedEager ||!!activatingConnector);
}

const Web3Status = (): JSX.Element => {
  const [show, setShow] = useState(false);
  const { chainId } = useWeb3Cache()
  const { active, account } = useWeb3React();
  
  useConnectedWallet();

  const chain = chainId && chainMap[chainId];
  return (
  <div className="
    flex
    items-center
    justify-evenly
    ">
    { show && <WalletModal setShow={setShow} />}
    { chainId && 
      <p className={`
        font-bold
        rounded-xl
        py-1
        px-3
        ${chain ? 'text-white' : 'text-red-600'}
        bg-${chain ? chain.color : ''}
      `}>
        { chain ? chain.name : 'Network Not Supported' }
      </p>
    }
    <button className="mx-5" onClick={() => {
      setShow(true)
    }}>
      { active && account
        ? trimAccount(account)
        : 'Connect Web3' }
    </button>
  </div>
  )
}

const Header = () => {
  // const triedEager = useEagerConnect();
  const [showError, setShowError] = useState(false)
  const [clicked, setClicked] = useState(false)
  const error = useAppSelector(state => state.app.error);
  return (
    <>
    <header
      className="
      bg-white
      grid
      grid-cols-3
      fixed w-full
      top-0
      h-14
      z-10
      pt-1
      "
    >
      <div className="flex justify-start">
        <img src={logoFile} className="h-14 ml-2 w-14 flex-grow-1 basis-0"/>
      </div>
        <h1 className="m-auto">Auxo Vaults</h1>
      <div className="flex justify-end items-center">
      { error && <button
        onMouseEnter={() => setShowError(true)}
        onMouseLeave={() => {
          if (!clicked) setShowError(false)
        }}
        onClick={() => {
          setClicked(true)
          setShowError(true)
        }}
        className="
          bg-red-700
          text-white
          rounded-xl
          py-1
          px-2
          font-extrabold
          mr-2
          text-center
        "
        >Error</button>}
        <Web3Status />
      </div>
    </header>
    {showError && <div className="fixed top-14 flex justify-center w-full">
      <ErrorMessage setClicked={setClicked} setShowError={setShowError}/>
    </div>}
    </>

  )
};
export default Header;