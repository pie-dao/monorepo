import { Dispatch, SetStateAction } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Lock from '../Lock/Lock';
import * as Slider from '@radix-ui/react-slider';

type Props = {
  commitmentValue: number;
  setCommitmentValue: Dispatch<SetStateAction<number>>;
  maxLock: number;
};

const StakeSlider: React.FC<Props> = ({
  maxLock,
  commitmentValue,
  setCommitmentValue,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-center gap-x-2 w-full">
        <div className="flex items-center justify-between gap-x-4 w-full">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-[85%] h-6"
            defaultValue={[1]}
            max={maxLock}
            min={1}
            step={1}
            aria-label="Volume"
            onValueChange={(value) => {
              setCommitmentValue(value[0]);
            }}
          >
            <Slider.Track className="relative rounded-full flex-grow bg-sub-light h-2">
              <Slider.Range className="absolute bg-secondary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-[20px] h-[20px] bg-secondary shadow-sm rounded-xl" />
          </Slider.Root>
          <p className="text-primary font-bold text-sm w-[15%] shrink-0 text-right">
            {commitmentValue} {commitmentValue === 1 ? t('month') : t('months')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StakeSlider;
