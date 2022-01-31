import { ButtonHTMLAttributes } from "react"

export const StyledButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { className, ...rest } = props; 
  return (
    <button
        className={`
          bg-purple-700 font-bold
          border-purple-700
          text-white
          hover:text-purple-700
          hover:bg-transparent
          border-2
          rounded-md
          px-2 py-1 
          my-1
          text-center
          min-w-[120px]
          disabled:bg-gray-600
          disabled:text-gray-500
          disabled:border-gray-600
          ${className ? className : ''}
          `}
        onClick={rest.onClick}
        { ...rest }
      >
        {rest.children}
  </button>
  )
}

export const SwitcherButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <button
    className="
      bg-transparent
      mx-5
      text-purple-500
      font-extrabold
      hover:underline
      decoration-purple-500
      disabled:decoration-transparent
      disabled:text-purple-900
    "
    { ...props }
  >
    { props.children }
  </button>
)


export default StyledButton