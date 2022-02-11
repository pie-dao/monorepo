import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { MetamaskIcon, WalletConnectIcon } from "../../assets/icons/connectors";
import { injected, walletconnect } from "../../connectors";
import { useAppDispatch } from "../../hooks";
import { setAlert } from "../../store/app/app.slice";
import { supportedChainIds } from "../../utils/networks";
import StyledButton from "../UI/button";

const MetamaskButton = ({ setShow }: { setShow(show: boolean): void }): JSX.Element => {
const { activate } = useWeb3React();
const dispatch = useAppDispatch();
const handleConnect = () => {
  activate(injected, undefined, true).then(() => {
    setShow(false)
  }).catch(err => {
    if (err instanceof UnsupportedChainIdError) {
      dispatch(setAlert({
        message: `You are currently connected to an unsupported chain, supported chains are ${supportedChainIds}`,
        show: true,
        type: 'ERROR',
        action: 'SWITCH_NETWORK'
      }))
    } else {
      alert('Error in connecting')
    }
  })
}
return (
  <button
    onClick={() => handleConnect()}
    className="w-full flex justify-center items-center">
    <MetamaskIcon height={40} width={40} />
    <p className="text-left ml-5">Metamask</p>
  </button>
  )
}

const WalletConnectButton = () => {
  const { activate } = useWeb3React()
  const handleConnect = () => { 
    activate(walletconnect)
      .then(v => console.debug(v))
  }
  return (
    <button
      onClick={() => handleConnect()}
      className="w-full flex justify-center items-center">
      <WalletConnectIcon height={40} width={40} />
      <p className="text-left ml-5">WalletConnect</p>
    </button>
    )
  }
  
const HoverCard = (props: { children: React.ReactNode }) => (
  <div className="flex justify-center items-center h-36 w-full rounded-md hover:bg-gray-100">
    { props.children }
  </div>
)


const WalletModal = (props: { setShow: (show: boolean) => void }) => {
  const { deactivate } = useWeb3React()
  return (
    <div className="h-screen w-screen top-0 left-0 fixed z-9 bg-black bg-opacity-20" onClick={() => props.setShow(false)}>
      <section
        className="
        top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          max-w-[500px]
          w-full
          z-10
          bg-white
          flex items-center justify-between
          rounded-xl
          flex-col
          shadow-md
          p-5
          fixed
          
        "
        >
          <button className="absolute top-5 right-5" onClick={() => props.setShow(false)}>
            <RiCloseCircleFill color="black"/>
          </button>
          <h1 className="my-2 text-xl">Select a Wallet</h1>
          <div className="w-full">
            <HoverCard>
              <MetamaskButton setShow={props.setShow}/>
            </HoverCard>
            <HoverCard>
              <WalletConnectButton />
            </HoverCard>
          </div>
          <div className="mt-2">
            <StyledButton onClick={() => {
              deactivate()
              props.setShow(false)
            }}>Disconnect</StyledButton>
          </div>
      </section>
    </div>
  );
}
export default WalletModal