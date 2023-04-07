import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../../hooks';
import Image from 'next/image';
import { formatBalance } from '../../../utils/formatBalance';
import AUXOImage from '../../../public/tokens/AUXO.svg';
import ARVImage from '../../../public/tokens/24x24/ARV.svg';
import xAUXOImage from '../../../public/tokens/24x24/PRV.svg';
import { useChainExplorer } from '../../../hooks/useToken';
import RiveComponent, { Alignment, Fit, Layout } from '@rive-app/react-canvas';

const imageMap = {
  AUXO: AUXOImage,
  ARV: ARVImage,
  PRV: xAUXOImage,
};

export default function StakeComplete({
  action,
}: {
  action?: 'stake' | 'unstake' | 'convert';
}) {
  const { t } = useTranslation();
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const chainExplorer = useChainExplorer();

  return (
    <>
      {action === 'convert' && (
        <div className="flex flex-col items-center justify-center w-full gap-y-4">
          <div className="h-[180px] w-full rounded-lg overflow-hidden">
            <RiveComponent
              src={'/animations/AUXO-PRV.riv'}
              layout={
                new Layout({
                  fit: Fit.Contain,
                  alignment: Alignment.Center,
                })
              }
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-y-4 rounded-lg px-2 py-4 m-2 bg-[url('/images/background/bg-rewards.png')] bg-cover shadow-md relative">
            <div className="absolute inset-0 bg-white opacity-30 z-0" />
            <p className="bg-clip-text text-transparent bg-gradient-major-secondary-predominant font-bold text-xl z-10">
              {t('converted')}
            </p>
            <div className="text-2xl text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg z-10">
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
                  href={
                    chainExplorer?.url
                      ? `${chainExplorer?.url}/tx/${tx?.hash}`
                      : '#'
                  }
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
      )}
      {action === 'unstake' && (
        <div className="flex flex-col items-center justify-center w-full gap-y-4">
          <div className="h-[180px] w-full rounded-lg overflow-hidden">
            <RiveComponent
              src={'/animations/AUXO-PRV.riv'}
              layout={
                new Layout({
                  fit: Fit.Contain,
                  alignment: Alignment.Center,
                })
              }
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-y-4 rounded-lg px-2 py-4 m-2 bg-[url('/images/background/bg-rewards.png')] bg-cover shadow-md relative">
            <div className="absolute inset-0 bg-white opacity-30 z-0" />
            <p className="bg-clip-text text-transparent bg-gradient-major-secondary-predominant font-bold text-xl z-10">
              {t('unstakeCompleted')}
            </p>
            <div className="text-2xl text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg z-10">
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
                  href={
                    chainExplorer?.url
                      ? `${chainExplorer?.url}/tx/${tx?.hash}`
                      : '#'
                  }
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
      )}
    </>
  );
}
