import { useWeb3React } from "@web3-react/core";
import WalletModal from "./WalletModal";
import { useEffect, useState } from "react";
import AlertMessage from "./AlertMessage";
import { useWeb3Cache } from "../../hooks/useCachedWeb3";
import { useEagerConnect, useInactiveListener } from "../../hooks/useWeb3";
import { network } from "../../connectors";
import { GiHamburgerMenu } from "react-icons/gi";
import { AccountConnector, AlertButton, CreateAlert, NetworkDisplay } from "./MenuButtons";

const auxoLogo = process.env.PUBLIC_URL + '/auxo-logo.png'

const useFallBack = () => {
  const { active, activate } = useWeb3React()
  const { chainId } = useWeb3Cache();
  useEffect(() => {
    if (!active) activate(network)
  }, [active, chainId, activate])
}

const useConnectedWallet = () => {
  const { connector } = useWeb3React();
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const triedEager = useEagerConnect();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  useFallBack();
  useInactiveListener(
    !triedEager ||
    !!activatingConnector);
}

const MobileMenu = (): JSX.Element => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <>
    { show && <WalletModal setShow={setShow} />}
    <GiHamburgerMenu onClick={() => setShowMobileMenu(!showMobileMenu)}/>
    { showMobileMenu && <section className="
      absolute
      top-10
      border-2
      border-grey-200
      shadow-md
      p-1
      h-36
      flex
      flex-col
      justify-between
      bg-white
      rounded-md
      w-48
    ">
      <div className="mt-3">
        <p className="text-gray-500 mb-1">Network</p>
        <NetworkDisplay />
      </div>
      <div className="h-[1px] bg-gray-200 w-full" />
      <AccountConnector setShow={setShow} />
    </section>
    }
    </>
  )
}

const DesktopMenu = (): JSX.Element => {
  const [show, setShow] = useState(false);
  return (
  <div className="
    flex
    items-center
    justify-evenly
    ">
    { show && <WalletModal setShow={setShow} />}
    <NetworkDisplay />
    <AccountConnector setShow={setShow} />
    <AlertButton />
  </div>
  )
}

const Header = () => {
  useConnectedWallet();
  return (
    <>
    <header
      className={`
      flex
      items-center
      justify-between
      w-full
      h-24
      z-10
      pt-1
      `}
    >
      <div className="w-16 sm:w-20 md:w-24">
        <img src={auxoLogo} alt="auxo-logo" className="object-contain"/>
      </div>
      <div className="hidden md:flex justify-end items-center">
        <DesktopMenu />
      </div>
      <div className="flex md:hidden justify-end">
        <MobileMenu />
      </div> 
      </header>
    </>
  )
};
export default Header;