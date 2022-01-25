import { ButtonHTMLAttributes } from "react"

export const StyledButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { className, ...rest } = props; 
  return (
    <button
        className={`
          bg-purple-400 font-bold
          border-purple-400
          text-white
          hover:text-purple-400
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
          ${className}
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
      text-purple-900
      font-extrabold
      hover:underline
      decoration-purple-900
      disabled:decoration-transparent
      disabled:text-purple-400
    "
    { ...props }
  >
    { props.children }
  </button>
)


export default StyledButton