const CardItem = (props: {
  left: string;
  right: string;
  loading?: boolean;
}) => {
  return (
    <div className="flex text-left justify-between text-xs sm:text-base w-full text-sub-dark">
      <p className="ml-0 sm:ml-2">{props.left}</p>
      <p className="ml-0 font-medium">
        {props.loading ? 'Loading...' : props.right}
      </p>
    </div>
  );
};

export default CardItem;
