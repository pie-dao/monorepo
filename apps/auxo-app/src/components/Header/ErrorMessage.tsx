import { useAppDispatch, useAppSelector } from "../../hooks"
import { setError } from "../../store/app/app.slice";
import { RiCloseCircleFill } from 'react-icons/ri';


function ErrorMessage(): JSX.Element {
  const error = useAppSelector(state => state.app.error);
  const dispatch = useAppDispatch();
  return (
    <span>{ error.show &&
      <div className="bg-red-500 py-1 w-screen flex justify-center items-center">
        <p className="text-white mr-2">{error.message}</p>
        <button
          onClick={() => {
            dispatch(setError({
              message: undefined,
              show: false
            }))
          }}><RiCloseCircleFill color="white"/></button>
      </div>
    }
    </span>
  )
}

export default ErrorMessage