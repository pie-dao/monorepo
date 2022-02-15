import { useAppDispatch, useAppSelector } from "../../hooks"
import { AlertTypes, AppState, setAlertDisplay } from "../../store/app/app.slice";
import { RiCloseCircleFill } from 'react-icons/ri';
import LoadingSpinner from "../UI/loadingSpinner";
import StyledButton from "../UI/button";
import { chainMap, changeNetwork, supportedChainIds } from "../../utils/networks";
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
  const firstSupportedChain = chainMap[firstSupportedChainId]
  return (
  <StyledButton 
    className="mx-2 bg-transparent my-0 p-0 border-0 shadow-md hover:text-white"
    onClick={() => changeNetwork({ chainId: firstSupportedChainId })}>
    Switch to {firstSupportedChain.name}
  </StyledButton>
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
      }, 4000);
      return () => {
        clearTimeout(timeout)
      }
    }
  },[alert, dispatch])

  return (
    <div className={`
        ${alert.show ? 'opacity-100' : 'opacity-0' }
          transition ease-in-out
          absolute flex justify-center w-full z-10
        `}>
      <div className={`${alertColor(alert.type)} 
        py-1 flex flex-col md:flex-row justify-center rounded-lg w-full items-center`
        }>
        <p className="text-white mr-2">{alert.message}</p>
        { alert.type === 'PENDING' && <LoadingSpinner spinnerClass="fill-white" className="text-white mr-2"/>}
        { alert.action && <ActionButton alert={alert} /> }
        <button
          onClick={() => {
            dispatch(setAlertDisplay(false))
          }}><RiCloseCircleFill color="white"/></button>
        
      </div>
    </div>
  )
}

export default AlertMessage