import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../../hooks';
import Image from 'next/image';
import { formatBalance } from '../../../utils/formatBalance';
import wEthImage from '../../../public/tokens/24x24/ETH.svg';
import { useChainExplorer } from '../../../hooks/useToken';

export default function WithdrawPrvCompleted() {
  const { t } = useTranslation();
  const { totalClaiming } = useAppSelector((state) => state.rewards.claimFlow);
  const { tx } = useAppSelector((state) => state.rewards.claimFlow);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const chainExplorer = useChainExplorer();

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-y-4">
        <div className="flex flex-col items-center justify-center w-full gap-y-4 rounded-lg px-2 py-4 m-2 relative">
          <div className="absolute inset-0 bg-white opacity-30 z-0" />
          <p className="bg-clip-text text-transparent bg-gradient-major-secondary-predominant font-bold text-xl z-10">
            {t('dissolutionSuccessTitle')}
          </p>
          <div className="text-2xl text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg z-10">
            <Image src={wEthImage} alt={'weth'} width={24} height={24} />
            <span>
              {formatBalance(
                totalClaiming?.label,
                defaultLocale,
                4,
                'standard',
              )}{' '}
              {t('wETH')}
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
    </>
  );
}
