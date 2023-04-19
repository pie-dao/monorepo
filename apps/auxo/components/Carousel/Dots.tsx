import classNames from '../../utils/classnames';

type Props = {
  itemsLength: number;
  selectedIndex: number;
  goTo: (index: number, jump?: boolean) => void;
};
const Dots = ({ itemsLength, selectedIndex, goTo }: Props) => {
  const arr = new Array(itemsLength).fill(0);
  return (
    <div
      className="flex gap-1 my-2 justify-center absolute top-5 
    left-1/2 transform -translate-x-1/2 gap-x-6"
    >
      {arr.map((_, index) => {
        const selected = index === selectedIndex;

        return (
          <button
            onClick={() => {
              goTo(index);
            }}
            className={classNames(
              'h-2 w-2 rounded-full transition-all duration-300 bg-secondary ring-2 inset ring-sub-light',
              !selected && 'bg-transparent ',
            )}
            key={index}
          ></button>
        );
      })}
    </div>
  );
};
export default Dots;
