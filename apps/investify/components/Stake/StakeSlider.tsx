import { Dispatch, SetStateAction } from 'react';
import useTranslation from 'next-translate/useTranslation';
import * as Slider from '@radix-ui/react-slider';
import Link from 'next/link';
import { useUserLockDuration } from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';

type Props = {
  commitmentValue: number;
  setCommitmentValue: Dispatch<SetStateAction<number>>;
  tokenConfig: TokenConfig;
};

const StakeSlider: React.FC<Props> = ({
  tokenConfig,
  commitmentValue,
  setCommitmentValue,
}) => {
  const { t } = useTranslation();
  const minLock = useUserLockDuration('veAUXO');

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-center w-full gap-x-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-current text-primary"
        >
          <path d="M12 2C7.02944 2 3 6.02944 3 11V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V11C21 6.02944 16.9706 2 12 2ZM12 4C15.3137 4 18 6.68629 18 10V11H6V10C6 6.68629 8.68629 4 12 4ZM12 16C10.8954 16 10 15.1046 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16Z" />
        </svg>
        <p>{t('stakeTime')}</p>
        <div className="flex items-center justify-start gap-x-2 w-full">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-48 h-6"
            defaultValue={[36]}
            max={36}
            min={minLock || 6}
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
          <p className="text-secondary font-medium text-md">
            {commitmentValue} {t('months')}
          </p>
        </div>
      </div>
      <div>
        <p className="underline text-sub-dark">
          <Link href="#">{t('whyLocked')}</Link>
        </p>
      </div>
    </div>
  );
};

export default StakeSlider;
