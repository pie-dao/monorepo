import { Dispatch, SetStateAction } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Lock from '../Lock/Lock';
import * as Slider from '@radix-ui/react-slider';
import { setIncreasedStakingValue } from '../../store/products/products.slice';
import { useAppDispatch, useAppSelector } from '../../hooks';

type Props = {
  maxLock: number;
};

const StakeSlider: React.FC<Props> = ({ maxLock }) => {
  const { t } = useTranslation();
  const { increasedStakingValue } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-center gap-x-2 w-full">
        <div className="flex items-center justify-between gap-x-4 w-full">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-[65%] sm:w-[85%] h-6"
            defaultValue={[0]}
            max={maxLock}
            min={0}
            step={1}
            aria-label="Volume"
            onValueChange={(value) => {
              dispatch(setIncreasedStakingValue(value[0]));
            }}
          >
            <Slider.Track className="relative rounded-full flex-grow bg-sub-light h-2">
              <Slider.Range className="absolute bg-secondary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-[20px] h-[20px] bg-secondary shadow-sm rounded-xl" />
          </Slider.Root>
          <p className="text-primary font-bold text-sm shrink-0 text-right">
            {increasedStakingValue}{' '}
            {increasedStakingValue === 1 ? t('month') : t('months')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StakeSlider;
