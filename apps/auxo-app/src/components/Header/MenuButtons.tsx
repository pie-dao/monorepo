import { useWeb3React } from "@web3-react/core";
import { FTMLogo } from "../../assets/icons/logos";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setAlert, setAlertDisplay } from "../../store/app/app.slice";
import StyledButton from "../UI/button";
import { FaBell } from 'react-icons/fa';
import { useChainHandler } from "../../hooks/useChainHandler";
import { useState } from "react";
import { useEffect } from "react";
import { logoSwitcher } from "../../utils/logos";

const trimAccount = (account: string): string => {
    return account.slice(0, 6) + '...' + account.slice(38)
}  

export const CreateAlert = () => {
  const dispatch = useAppDispatch()
  const onClick = () => {
    dispatch(setAlert({
      message: 'Tehre was a problem connecting to the network etc etc etc etc blaj ffekekfekak  adalelglgl ',
      type: 'ERROR',
      action: 'SWITCH_NETWORK'
    }))
  }
  return <button onClick={onClick}>Test Alert</button>
}

export const AlertButton = (): JSX.Element => {
    const [notification, setNotification] = useState(false);
    const dispatch = useAppDispatch();
    const alert = useAppSelector(state => state.app.alert);

    useEffect(() => {
      alert.message ? setNotification(true) : setNotification(false);
    }, [alert.message])

    return (
      <button
        className="rounded-md shadow-md h-8 lg:h-10 w-auto p-2 flex items-center justify-center bg-white relative mb-1"
        onClick={() => {
          if (alert.message) {
            console.debug('clicked')
            dispatch(setAlertDisplay(true));
            setNotification(false);
          }
        }}    
        >
        <FaBell className="fill-baby-blue-dark w-full h-full"/>
        { notification && <div className="bg-alert-error rounded-full h-3 w-3 absolute -top-0 -right-1"/>}
      </button>
    )
  }
  
const toProperCase = (s: string): string => s.slice(0, 1).toUpperCase() + s.slice(1, s.length).toLowerCase()

export const NetworkDisplay = () => {
    const chain = useChainHandler();
    console.debug({ chain })
    return (
      <>
       { chain &&
        <div className="py-1 pl-2 mb-1 pr-0 md:pr-10 
          flex items-center justify-center bg-white md:justify-start
          shadow-none md:shadow-md rounded-md"
        >
          <div className="h-6 w-6">
          { logoSwitcher(chain.symbol, { height: 6 }) }
          </div>
          <p className={`
            font-bold
            text-left
            text-gray-600
            text-sm
            lg:text-base
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
      <StyledButton className="pt-1 mb-0 h-full px-8 mx-0 my-0 md:mx-5
        text-xs md:text-sm lg:text-base "
        onClick={() => {
        setShow(true)
      }}>
        {buttonText}
      </StyledButton>
    )
  }
  