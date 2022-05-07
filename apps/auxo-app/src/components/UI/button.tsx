import { ButtonHTMLAttributes } from 'react';

export const StyledButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  const { className, ...rest } = props;
  return (
    <button
      className={`
          bg-baby-blue-dark font-bold
          border-baby-blue-dark
          text-white
          hover:text-baby-blue-dark
          hover:bg-transparent
          transition-colors
          delay-50
          text-sm
          sm:text-base
          sm:px-2 py-1 
          shadow-md
          border-2
          rounded-lg
          my-1
          text-center
          min-w-[80px]
          sm:min-w-[120px]
          disabled:bg-gray-300
          disabled:text-white
          disabled:shadow-none
          disabled:border-gray-300
          ${className ? className : ''}
          `}
      onClick={rest.onClick}
      {...rest}
    >
      {rest.children}
    </button>
  );
};

export const SwitcherButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>,
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
    {...props}
  >
    {props.children}
  </button>
);

export default StyledButton;
