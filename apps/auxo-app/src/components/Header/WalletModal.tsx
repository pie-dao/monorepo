import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import React from "react";
import { MetamaskIcon, WalletConnectIcon } from "../../assets/icons/connectors";
import { injected, walletconnect } from "../../connectors";

const MetamaskButton = ({ setShow }: { setShow(show: boolean): void }) => {
const { activate } = useWeb3React();
const handleConnect = () => {
  activate(injected, undefined, true).then(() => {
    setShow(false)
  }).catch(err => {
    if (err instanceof UnsupportedChainIdError) {
      alert('Chain not supported')
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

const WalletConnectButton = ({ setShow }: { setShow(show: boolean): void }) => {
  const { activate } = useWeb3React()
  const handleConnect = () => { activate(walletconnect).then(v => console.debug(v))
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
  return (
    <section
      className="
      top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        max-w-[500px]
        w-full
        h-1/3
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
        <div className="w-full">
          <HoverCard>
            <MetamaskButton setShow={props.setShow}/>
          </HoverCard>
          <HoverCard>
            <WalletConnectButton setShow={props.setShow}/>
          </HoverCard>
        </div>
        <div className="mt-1">
          <a
            href="https://ethereum.org/en/wallets/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <p>Learn more about wallets</p>
            <p>&#8594;</p>
          </a>
        <button onClick={() => props.setShow(false)}>CLOSE</button>
        </div>
    </section>
  );
}
export default WalletModal