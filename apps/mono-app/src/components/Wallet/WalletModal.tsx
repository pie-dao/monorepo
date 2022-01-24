import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { MetamaskIcon, WalletConnectIcon } from "../../assets/icons/connectors";
import { injected } from "../../connectors";

const MetamaskButton = ({ setShow }: { setShow(show: boolean): void }) => {
const { activate } = useWeb3React()
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
  const handleConnect = () => { activate(injected).then(() => {
    setShow(false)
  }) }
  return (
    <button
      onClick={() => handleConnect()}
      className="w-full flex justify-center items-center">
      <WalletConnectIcon height={40} width={40} />
      <p className="text-left ml-5">WalletConnect</p>
    </button>
    )
  }
  


const WalletModal = (props: { setShow: (show: boolean) => void }) => {
  return (
    <section
      className="
      top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        w-1/2
        h-1/3
        z-10
        bg-gray-50
        flex items-center justify-between
        rounded-md
        flex-col
        shadow-md
        p-5
        fixed

      "
      >
        <div className="mt-1">
          <h1>CONNECT WALLET</h1>
        </div>
        <div className="w-full">
          <div className="my-5">
            <MetamaskButton setShow={props.setShow}/>
          </div>
          <div className="my-10">
            <WalletConnectButton setShow={props.setShow}/>
          </div>
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
        </div>
        <button onClick={() => props.setShow(false)}>CLOSE</button>
    </section>
  );
}
export default WalletModal