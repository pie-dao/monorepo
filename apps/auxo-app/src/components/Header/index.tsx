import { useWeb3React } from '@web3-react/core';
import WalletModal from './WalletModal';
import { useEffect, useState } from 'react';
import { useWeb3Cache } from '../../hooks/useCachedWeb3';
import { useEagerConnect, useInactiveListener } from '../../hooks/useWeb3';
import { network } from '../../connectors';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AccountConnector, AlertButton } from './MenuButtons';
import { Divider } from '../UI/divider';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import NetworkSwitcher from '../UI/networkDropdown';

const auxoLogo = process.env.PUBLIC_URL + '/auxo-logo.png';

const useFallBack = () => {
  const { active, activate } = useWeb3React();
  const { chainId } = useWeb3Cache();
  useEffect(() => {
    if (!active) activate(network);
  }, [active, chainId, activate]);
};

const useConnectedWallet = () => {
  const { connector } = useWeb3React();
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const triedEager = useEagerConnect();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useFallBack();
  useInactiveListener(!triedEager || !!activatingConnector);
};

const MobileMenu = ({
  account,
}: {
  account: string | null | undefined;
}): JSX.Element => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (show) setShowMobileMenu(false);
  }, [show]);
  return (
    <>
      {show && <WalletModal setShow={setShow} />}
      <GiHamburgerMenu
        size={24}
        className="mr-1"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      />
      {showMobileMenu && (
        <div
          className="w-screen min-h-screen min-w-screen top-0 left-0 fixed h-screen z-10 bg-black bg-opacity-20"
          onClick={() => setShowMobileMenu(false)}
        >
          <section
            className="
        absolute
        top-24 left-1/2 transform -translate-x-1/2
        border-2
        border-grey-200
        shadow-md
        p-1
        z-10
        h-1/6
        w-3/4
        flex
        flex-col
        justify-between
        bg-white
        rounded-lg
      "
          >
            <button
              className="absolute top-2 right-2"
              onClick={() => setShowMobileMenu(false)}
            >
              <RiCloseCircleFill className="fill-baby-blue-dark" />
            </button>
            <div className="mt-3 flex flex-col justify-start items-center h-full">
              <p className="text-gray-700 text-lg mb-1 font-bold">Network</p>
              <NetworkSwitcher disabled={!account} />
            </div>
            <div className="flex flex-col justify-between">
              <Divider className="my-3" />
              <AccountConnector setShow={setShow} />
            </div>
          </section>
        </div>
      )}
    </>
  );
};

const DesktopMenu = ({
  account,
}: {
  account: string | null | undefined;
}): JSX.Element => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="
    flex
    items-center
    justify-evenly
    "
    >
      {show && <WalletModal setShow={setShow} />}
      {/* <NetworkDisplay /> */}
      <NetworkSwitcher disabled={!account} />
      <AccountConnector setShow={setShow} />
      <AlertButton />
    </div>
  );
};

const Header = () => {
  useConnectedWallet();
  const navigate = useNavigate();
  const { account } = useWeb3React();
  return (
    <>
      <header
        className={`
      flex
      items-center
      justify-between
      w-full
      px-4 md:px-0
      sm:h-24
      pt-1
      `}
      >
        <div
          className="w-24 sm:w-32 md:w-36 my-5 lg:my-0 ml-1 sm:ml-0 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src={auxoLogo} alt="auxo-logo" className="object-contain" />
        </div>
        <div className="hidden md:flex justify-end items-center">
          <DesktopMenu account={account} />
        </div>
        <div className="flex md:hidden justify-end">
          <MobileMenu account={account} />
        </div>
      </header>
    </>
  );
};
export default Header;
