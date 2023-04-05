import classNames from '../../utils/classnames';

type Props = {
  itemsLength: number;
  selectedIndex: number;
};
const Dots = ({ itemsLength, selectedIndex }: Props) => {
  const arr = new Array(itemsLength).fill(0);
  return (
    <div
      className="flex gap-1 my-2 justify-center absolute top-5 
    left-1/2 transform -translate-x-1/2 gap-x-6"
    >
      {arr.map((_, index) => {
        const selected = index === selectedIndex;
        return (
          <div
            className={classNames(
              'h-2 w-2 rounded-full transition-all duration-300 bg-secondary ring-2 inset ring-sub-light',
              !selected && 'bg-transparent ',
            )}
            key={index}
          ></div>
        );
      })}
    </div>
  );
};
export default Dots;
