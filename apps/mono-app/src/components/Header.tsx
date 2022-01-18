import { LogoIcon } from "@piedao/ui-atoms";
import { useWeb3React } from "@web3-react/core";
const Header = ({ setShow }: { setShow: (show: boolean) => void }) => {
  const { active, deactivate } = useWeb3React();
  return (
    <header
      className="
      border-2
      flex justify-between
      fixed w-full
      top-0
      z-10
      bg-white
      "
    >
      <div className="h-10 w-10">
      <LogoIcon size="sm" />
      </div>
      <h1 className="hidden sm:block">Mono Vaults</h1>
      <img className="block sm:hidden" alt="menu" onClick={() => setShow(true)}></img>
      <button className="hidden sm:block" onClick={() => {
        active ? deactivate() : setShow(true)
      }}>
        { active ? 'Disconnect' : 'Connect Web3' }
      </button>
    </header>
  )
};
export default Header;