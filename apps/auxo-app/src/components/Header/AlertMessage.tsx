import { useAppDispatch, useAppSelector } from "../../hooks"
import { AlertTypes, AppState, setAlertDisplay } from "../../store/app/app.slice";
import { RiCloseCircleFill } from 'react-icons/ri';
import LoadingSpinner from "../UI/loadingSpinner";
import { changeNetwork, supportedChainIds } from "../../utils/networks";
import { useEffect } from "react";

const alertColor = (type: AlertTypes) => {
  switch (type) {
    case 'SUCCESS': {
      return 'bg-alert-success';
    }
    case 'PENDING': {
      return 'bg-alert-pending';
    }
    case 'ERROR': {
      return 'bg-alert-error';
    }
    default: {
      return 'bg-alert-error';
    }
  }
}

function SwitchNetworkButton() {
  const firstSupportedChainId = supportedChainIds[0];
  return (
  <button 
    className="mx-4 text-white border-2 border-red-300 rounded-lg px-3 hover:bg-red-300 hover:text-alert-error"
    onClick={() => changeNetwork({ chainId: firstSupportedChainId })}>
    Switch Network
  </button>
  )
}

function ActionButton({ alert }: { alert: AppState['alert'] }) {
  switch (alert.action) {
    case 'SWITCH_NETWORK': {
      return <SwitchNetworkButton />
    }
    default: {
      return <></>
    }
  }
}

function AlertMessage(): JSX.Element {
  const alert = useAppSelector(state => state.app.alert);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (alert.action !== 'SWITCH_NETWORK') {
      const timeout = setTimeout(() => {
        dispatch(setAlertDisplay(false));
      }, 4_000);
      return () => {
        clearTimeout(timeout)
      }
    }
  },[alert, dispatch])

  return (
      <div className={`
        ${alert.show ? 'opacity-100 z-10' : 'opacity-0 -z-10' }
          transition ease-in-out shadow-lg
          absolute flex justify-center w-full
        `}>
          <div className={`${alertColor(alert.type)} 
          py-2 md:py-1 flex flex-wrap  
          justify-center rounded-lg w-full items-center`
        }>
        <p className="text-white mr-2 m-1 sm:m-0">{alert.message}</p>
        { 
          alert.type === 'PENDING' && 
          <span className="mx-2">
            <LoadingSpinner spinnerClass="fill-white" className="text-white mx-2"/>
          </span>
        }
        { 
          alert.action &&
          <ActionButton alert={alert} />
        }
        <button
          onClick={() => {
            dispatch(setAlertDisplay(false))
          }}><RiCloseCircleFill className="ml-2" color="white"/></button>
        
      </div>
    </div>
  )
}

export default AlertMessage