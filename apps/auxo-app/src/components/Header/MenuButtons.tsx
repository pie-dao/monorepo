import { useWeb3React } from "@web3-react/core";
import { FTMLogo } from "../../assets/icons/logos";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setAlertDisplay } from "../../store/app/app.slice";
import StyledButton from "../UI/button";
import { FaBell } from 'react-icons/fa';
import { useChainHandler } from "../../hooks/useChainHandler";

const trimAccount = (account: string): string => {
    return account.slice(0, 6) + '...' + account.slice(38)
}  

export const AlertButton = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(state => state.app.alert);
    return (
      <button
        className="rounded-md shadow-md p-2 relative"
        onClick={() => {
          if (error.message) {
            dispatch(setAlertDisplay(true))
          }
        }}    
        >
        <FaBell color="purple"/>
        { error.message && <div className="bg-red-700 rounded-full h-3 w-3 absolute -top-0 -right-1"/>}
      </button>
    )
  }
  
export const NetworkDisplay = () => {
    const chain = useChainHandler();
    return (
      <>
       { chain &&
        <div className="flex items-center justify-center md:justify-start shadow-none md:shadow-md rounded-md px-2">
          <FTMLogo colors={{ primary: 'white', bg: 'purple' }} height={5} />
          <p className={`
            font-bold
            text-sm
            rounded-xl
            py-1
            px-3
            ${chain ? 'text-black' : 'text-red-600'}
            bg-${chain ? chain.color : ''}
          `}>
            { chain ? chain.name : 'Network Not Supported' }
          </p>
        </div>
      }
      </>
    )
  }
  
export const AccountConnector = ({ setShow }: { setShow: (s: boolean) => void }) => {
    const { active, account } = useWeb3React();
    return (
      <StyledButton className="rounded-sm md:rounded-md md:mx-5 text-xs" onClick={() => {
        setShow(true)
      }}>
        { active && account
          ? trimAccount(account)
          : 'Connect Web3' }
      </StyledButton>
    )
  }
  