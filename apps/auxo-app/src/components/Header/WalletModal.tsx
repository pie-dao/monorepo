import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import React, { ButtonHTMLAttributes } from 'react';
import { RiCloseCircleFill } from 'react-icons/ri';
import { MetamaskIcon, WalletConnectIcon } from '../../assets/icons/connectors';
import { injected, walletconnect } from '../../connectors';
import { useAppDispatch } from '../../hooks';
import { setAlert } from '../../store/app/app.slice';
import { setResetUserVaultDetails } from '../../store/vault/vault.slice';
import { SetStateType } from '../../types/utilities';
import StyledButton from '../UI/button';

const MetamaskButton = ({
  setShow,
}: {
  setShow(show: boolean): void;
}): JSX.Element => {
  const { activate } = useWeb3React();
  const dispatch = useAppDispatch();
  const handleConnect = () => {
    activate(injected, undefined, true)
      .then(() => {
        setShow(false);
      })
      .catch((err) => {
        if (err instanceof UnsupportedChainIdError) {
          dispatch(
            setAlert({
              message: 'You are currently connected to an unsupported chain',
              type: 'ERROR',
              action: 'SWITCH_NETWORK',
            }),
          );
        } else {
          alert('Error in connecting');
        }
      });
  };
  return (
    <HoverButton onClick={() => handleConnect()}>
      <div className="w-full flex justify-center items-center">
        <MetamaskIcon height={40} width={40} />
        <p className="text-left ml-5">Metamask</p>
      </div>
    </HoverButton>
  );
};

const WalletConnectButton = () => {
  const { activate } = useWeb3React();
  const handleConnect = () => {
    activate(walletconnect).then(console.log);
  };
  return (
    <HoverButton onClick={() => handleConnect()}>
      <div className="w-full flex justify-center items-center">
        <WalletConnectIcon height={40} width={40} />
        <p className="text-left ml-5">WalletConnect</p>
      </div>
    </HoverButton>
  );
};

const HoverButton: React.FC<
  { children: React.ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => (
  <button
    className="flex justify-center items-center h-36 w-full rounded-md hover:bg-gray-100"
    {...props}
  >
    {props.children}
  </button>
);

const WalletModal = (props: { setShow: SetStateType<boolean> }) => {
  const { deactivate } = useWeb3React();
  const dispatch = useAppDispatch();
  return (
    <div
      className="h-screen w-screen top-0 left-0 fixed z-10 bg-black bg-opacity-20"
      onClick={() => props.setShow(false)}
    >
      <section
        className="
          top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          max-w-[500px]
          w-full
          bg-white
          flex items-center justify-between
          rounded-xl
          flex-col
          shadow-md
          p-5
          fixed
        "
      >
        <button
          className="absolute top-5 right-5"
          onClick={() => props.setShow(false)}
        >
          <RiCloseCircleFill className="fill-baby-blue-dark" />
        </button>
        <h1 className="my-2 text-xl text-gray-600">Select a Wallet</h1>
        <div className="w-full">
          <MetamaskButton setShow={props.setShow} />
          <WalletConnectButton />
        </div>
        <div className="mt-2">
          <StyledButton
            onClick={() => {
              deactivate();
              dispatch(setResetUserVaultDetails());
              props.setShow(false);
            }}
            className="px-5 sm:px-0"
          >
            Disconnect
          </StyledButton>
        </div>
      </section>
    </div>
  );
};
export default WalletModal;
