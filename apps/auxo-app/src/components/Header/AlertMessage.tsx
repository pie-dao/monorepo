import { useAppDispatch, useAppSelector } from "../../hooks"
import { AlertTypes, clearAlert } from "../../store/app/app.slice";
import { RiCloseCircleFill } from 'react-icons/ri';
import LoadingSpinner from "../UI/loadingSpinner";


const alertColor = (type: AlertTypes) => {
  switch (type) {
    case 'SUCCESS': {
      return 'bg-green-700';
    }
    case 'PENDING': {
      return 'bg-yellow-600';
    }
    case 'ERROR': {
      return 'bg-red-500';
    }
    default: {
      return 'bg-red-500';
    }
  }
}

function AlertMessage(): JSX.Element {
  const alert = useAppSelector(state => state.app.alert);
  const dispatch = useAppDispatch();
  return (
    <div className="fixed top-14 flex justify-center w-full z-10">
    { alert.show &&
      <div className={`${alertColor(alert.type)} py-1 w-screen flex justify-center items-center`}>
        <p className="text-white mr-2">{alert.message}</p>
        { alert.type === 'PENDING' && <LoadingSpinner className="text-white mr-2"/>}
        <button
          onClick={() => {
            dispatch(clearAlert())
          }}><RiCloseCircleFill color="white"/></button>
      </div>
    }
    </div>
  )
}

export default AlertMessage