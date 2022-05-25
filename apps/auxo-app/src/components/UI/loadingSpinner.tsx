const LoadingSpinner: React.FC<{
  className?: string;
  spinnerClass?: string;
  fill?: string;
  stroke?: string;
}> = ({ className, spinnerClass, fill, stroke }) => (
  <span className={'flex justify-center align-middle items-center'}>
    <svg
      className={'animate-spin h-5 w-5 text-white' + spinnerClass}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={stroke || 'gray'}
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill={fill || 'white'}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </span>
);

export const LoadingSpinnerWithText: React.FC<{ text: string }> = ({
  text,
}) => (
  <div className="flex justify-center w-full">
    <p className="mr-3">{text}</p>
    <LoadingSpinner />
  </div>
);
export default LoadingSpinner;
