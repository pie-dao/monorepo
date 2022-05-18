const CardItem = (props: {
  left: string;
  right: string;
  loading?: boolean;
}) => {
  return (
    <div className="flex justify-between text-left text-xs sm:text-base w-full my-1 text-gray-600">
      <p className="ml-0 sm:ml-2">{props.left}</p>
      <p className="ml-0 sm:mr-2 font-bold text-gray-400">
        {props.loading ? 'Loading...' : props.right}
      </p>
    </div>
  );
};

export default CardItem;
