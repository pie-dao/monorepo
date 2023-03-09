import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../../../hooks';
import Image from 'next/image';
import { formatBalance } from '../../../../utils/formatBalance';
import ArvImage from '../../../../public/tokens/24x24/ARV.svg';
import { useChainExplorer } from '../../../../hooks/useToken';
import { Discord } from '../../../Socials/Socials';
import ArrowRight from '../../../../public/images/icons/arrow-right.svg';
import RiveComponent, { Alignment, Fit, Layout } from '@rive-app/react-canvas';

import AUXOImage from '../../../../public/tokens/AUXO.svg';
import veAUXOImage from '../../../../public/tokens/24x24/ARV.svg';
import xAUXOImage from '../../../../public/tokens/24x24/PRV.svg';

const imageMap = {
  AUXO: AUXOImage,
  ARV: veAUXOImage,
  PRV: xAUXOImage,
};

export default function UnstakeCompleted() {
  const { t } = useTranslation();
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const chainExplorer = useChainExplorer();
  return (
    <div className="flex flex-col items-center justify-center w-full gap-y-4">
      <div className="h-[180px] w-full rounded-lg overflow-hidden">
        <RiveComponent
          src={'/animations/ARV-PRV.riv'}
          layout={
            new Layout({
              fit: Fit.Cover,
              alignment: Alignment.Center,
            })
          }
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-y-4 rounded-lg px-2 py-4 m-2 bg-[url('/images/background/bg-rewards.png')] bg-cover shadow-md relative">
        <div className="absolute inset-0 bg-white opacity-30 z-0" />
        <p className="bg-clip-text text-transparent bg-gradient-major-secondary-predominant font-bold text-xl z-10">
          {t('movedPosition')}
        </p>
        {swap && (
          <div className="grid grid-cols-[1fr_max-content_1fr] place-content-center gap-x-2">
            <div className="text-xl text-primary font-medium flex items-center gap-x-2 justify-self-end">
              <Image
                src={imageMap[swap.from.token]}
                alt={swap.from.token}
                width={32}
                height={32}
              />
              <span>
                {formatBalance(
                  swap.from.amount.label,
                  defaultLocale,
                  2,
                  'standard',
                )}{' '}
                {swap.from.token}
              </span>
            </div>
            <div className="flex items-center">
              <Image src={ArrowRight} alt={'transfer'} width={24} height={24} />
            </div>
            <div className="text-2xl text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg">
              <Image
                src={imageMap[swap.to.token]}
                alt={swap.to.token}
                width={24}
                height={24}
              />
              <span>
                {formatBalance(
                  swap.to.amount.label,
                  defaultLocale,
                  4,
                  'standard',
                )}{' '}
                {swap.to.token}
              </span>
            </div>
          </div>
        )}
      </div>
      {tx?.hash && (
        <div className="flex items-center self-center justify-between w-full py-2">
          <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
            <Image
              src={'/images/icons/etherscan.svg'}
              alt={'etherscan'}
              width={24}
              height={24}
            />
            <span className="text-sm text-sub-dark font-medium">
              {t('tx')}:
            </span>
          </div>
          <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
            <a
              href={`${chainExplorer?.url}/tx/${tx?.hash}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary truncate underline max-w-xs"
            >
              {tx?.hash}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
