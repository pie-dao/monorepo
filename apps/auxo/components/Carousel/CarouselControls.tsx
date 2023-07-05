// components/CarouselControls.tsx
import { ChevronRightIcon } from '@heroicons/react/outline';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import classNames from 'classnames';

type Props = {
  canScrollPrev?: boolean;
  canScrollNext?: boolean;
  onPrev?(): void;
  onNext?(): void;
  position: 'left' | 'right';
};
const CarouselControls = (props: Props) => {
  const disabled =
    props.position === 'left'
      ? !props.canScrollPrev
      : props.position === 'right' && !props.canScrollNext;
  return (
    <div
      className={classNames(
        'absolute top-1/2 transform -translate-y-1/2',
        props.position === 'left' && 'left-0',
        props.position === 'right' && 'right-0',
      )}
    >
      <button
        onClick={() => {
          props.position === 'left' && props.canScrollPrev && props.onPrev();
          props.position === 'right' && props.canScrollNext && props.onNext();
        }}
        disabled={disabled}
        className={classNames(
          'px-1 lg:px-4 lg:py-2 text-white rounded-md',
          disabled && 'opacity-50',
        )}
      >
        {props.position === 'left' ? (
          <ChevronLeftIcon className="w-5 h-5" />
        ) : (
          <ChevronRightIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};
export default CarouselControls;
