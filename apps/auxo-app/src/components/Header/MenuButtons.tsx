import { useWeb3React } from "@web3-react/core";
import { FTMLogo } from "../../assets/icons/logos";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setAlert, setAlertDisplay } from "../../store/app/app.slice";
import StyledButton from "../UI/button";
import { FaBell } from 'react-icons/fa';
import { useChainHandler } from "../../hooks/useChainHandler";

const trimAccount = (account: string): string => {
    return account.slice(0, 6) + '...' + account.slice(38)
}  

export const CreateAlert = () => {
  const dispatch = useAppDispatch()
  const onClick = () => {
    dispatch(setAlert({
      message: 'Test Alert',
      type: 'ERROR',
      show: true
    }))
  }
  return <button onClick={onClick}>Test Alert</button>
}

export const AlertButton = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(state => state.app.alert);
    return (
      <button
        className="rounded-md shadow-md h-10 w-10 p-2 flex items-center justify-center bg-white relative mb-1"
        onClick={() => {
          if (error.message) {
            dispatch(setAlertDisplay(true))
          }
        }}    
        >
        <FaBell className="fill-baby-blue-dark w-full h-full"/>
        { error.message && <div className="bg-red-700 rounded-full h-3 w-3 absolute -top-0 -right-1"/>}
      </button>
    )
  }
  
const toProperCase = (s: string): string => s.slice(0, 1).toUpperCase() + s.slice(1, s.length).toLowerCase()

export const NetworkDisplay = () => {
    const chain = useChainHandler();
    return (
      <>
       { chain &&
        <div className="py-1 pl-2 mb-1 pr-10 flex items-center bg-white justify-start md:justify-start shadow-none md:shadow-md rounded-md "
        >
          <FTMLogo colors={{ primary: 'white', bg: '#7065F4' }} height={6} />
          <p className={`
            font-bold
            text-gray-600
            text-md
            rounded-xl
            py-1
            px-3
            ${chain ? 'text-black' : 'text-red-600'}
          `}>
            { chain ? toProperCase(chain.name) : 'Network Not Supported' }
          </p>
        </div>
      }
      </>
    )
  }
  
export const AccountConnector = ({ setShow }: { setShow: (s: boolean) => void }) => {
    const { active, account } = useWeb3React();
    const buttonText = active && account
      ? trimAccount(account)
      : 'Connect Web3'
    ;
    return (
      <StyledButton className="py-1 px-8 mx-5 text-md" onClick={() => {
        setShow(true)
      }}>
        {buttonText}
      </StyledButton>
    )
  }
  