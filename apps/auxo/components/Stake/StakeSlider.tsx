import { Dispatch, SetStateAction } from 'react';
import useTranslation from 'next-translate/useTranslation';
import * as Slider from '@radix-ui/react-slider';
import Image from 'next/image';
import Link from 'next/link';
import { useUserLockDuration } from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import Lock from '../../public/images/icons/lock.svg';

type Props = {
  commitmentValue: number;
  setCommitmentValue: Dispatch<SetStateAction<number>>;
};

const StakeSlider: React.FC<Props> = ({
  commitmentValue,
  setCommitmentValue,
}) => {
  const { t } = useTranslation();
  const minLock = useUserLockDuration('ARV');

  return (
    <div className="flex flex-col items-center justify-between w-full gap-y-2">
      <div className="flex items-center justify-between w-full gap-x-2">
        <div className="flex gap-x-1 items-center">
          <div className="flex flex-shrink-0">
            <Image src={Lock} alt="lock" width={12} height={12} />
          </div>
          <p className="text-sm font-medium text-primary">{t('stakeTime')}</p>
        </div>
        <div>
          <a
            href="https://docs.auxo.fi/auxo-docs/rewards-vaults/arv-active-rewards-vault"
            target="_blank"
            rel="noreferrer noopener"
            className="underline text-sub-dark hover:text-secondary text-xs"
          >
            {t('whyLocked')}
          </a>
        </div>
      </div>
      <div className="flex items-center justify-between gap-x-4 w-full">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-[65%] sm:w-[85%] h-6"
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
        <p className="text-primary font-bold text-sm shrink-0 text-right">
          {commitmentValue} {t('months')}
        </p>
      </div>
      <div className="flex items-center justify-between gap-x-4 w-full">
        <p className="text-base font-medium text-primary">
          {t('rewardLevel')}:
        </p>
        <p className="text-secondary font-bold text-base shrink-0 text-right">
          {t('levelOf', { level: commitmentValue - 6 })}
        </p>
      </div>
    </div>
  );
};

export default StakeSlider;
