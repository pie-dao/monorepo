import { useAppDispatch, useAppSelector } from "../../hooks"
import { setError } from "../../store/app/app.slice";

function ErrorMessage({ setShowError, setClicked }: { setShowError: (s: boolean) => void, setClicked: (s: boolean) => void }): JSX.Element {
  const error = useAppSelector(state => state.app.error);
  // const error = 'there was an error'
  const dispatch = useAppDispatch()
  return (
    <span>{ error &&
      <div className="bg-red-400 py-1 w-screen flex justify-center items-center">
        <p className="text-white mr-5">{error}</p>
        <button
          className="rounded-full p-0.5 w-6 h-6 bg-white text-red-700" 
          onClick={() => {
            setShowError(false)
            setClicked(false)
            dispatch(setError(undefined))
          }}>X</button>
      </div>
    }
    </span>
  )
} 

export default ErrorMessage