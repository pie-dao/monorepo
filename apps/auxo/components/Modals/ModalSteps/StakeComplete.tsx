import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../../hooks';
import Image from 'next/image';
import ArrowRight from '../../../public/images/icons/arrow-right.svg';
import { formatBalance } from '../../../utils/formatBalance';
import classNames from '../../../utils/classnames';
import { useMemo } from 'react';
import AUXOImage from '../../../public/tokens/AUXO.svg';
import veAUXOImage from '../../../public/tokens/24x24/ARV.svg';
import xAUXOImage from '../../../public/tokens/24x24/PRV.svg';
import { useChainExplorer } from '../../../hooks/useToken';

const imageMap = {
  AUXO: AUXOImage,
  ARV: veAUXOImage,
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
  const { hash } = tx;
  const chainExplorer = useChainExplorer();

  const actionMap = useMemo(() => {
    switch (action) {
      case 'stake':
        if (swap?.to?.token === 'ARV') {
          return t('stakedArv');
        }
        return t('staked', { token: swap?.to?.token });
      case 'unstake':
        return t('unstaked', { token: swap?.to?.token });
      case 'convert':
        return t('converted', { token: swap?.to?.token });
      default:
        return null;
    }
  }, [action, swap.to.token, t]);
  //   <>
  //     <div className="flex flex-col items-center justify-center w-full gap-y-6">
  //       <div className="mt-2">
  //         <p className="text-lg text-sub-dark font-medium">{actionMap}</p>
  //       </div>
  //       <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
  //         {}
  //         {swap && (
  //           <div
  //             className={classNames(
  //               'grid justify-items-center w-full py-2',
  //               swap.to.token ? 'grid-cols-3' : 'grid-cols-2',
  //             )}
  //           >
  //             {swap?.to?.token ? (
  //               <>
  //                 <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start">
  //                   <Image
  //                     src={imageMap[swap.from.token]}
  //                     alt={swap.from.token}
  //                     width={24}
  //                     height={24}
  //                   />
  //                   <span className="text-xl font-semibold text-primary">
  //                     {formatBalance(
  //                       swap.from.amount.label,
  //                       defaultLocale,
  //                       2,
  //                       'standard',
  //                     )}{' '}
  //                     {swap.from.token}
  //                   </span>
  //                 </div>
  //                 <div className="flex items-center">
  //                   <Image
  //                     src={ArrowRight}
  //                     alt={'transfer'}
  //                     width={24}
  //                     height={24}
  //                   />
  //                 </div>
  //                 <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-end">
  //                   <Image
  //                     src={imageMap[swap.to.token]}
  //                     alt={swap.to.token}
  //                     width={24}
  //                     height={24}
  //                   />
  //                   <span className="text-xl font-medium text-secondary">
  //                     {formatBalance(
  //                       swap.to.amount.label,
  //                       defaultLocale,
  //                       2,
  //                       'standard',
  //                     )}{' '}
  //                     {swap.to.token}
  //                   </span>
  //                 </div>
  //               </>
  //             ) : (
  //               <>
  //                 <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start">
  //                   <span className="text-xl font-semibold text-primary">
  //                     {t('amount')}:
  //                   </span>
  //                 </div>
  //                 <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-end">
  //                   <Image
  //                     src={imageMap[swap.from.token]}
  //                     alt={swap.from.token}
  //                     width={24}
  //                     height={24}
  //                   />
  //                   <span className="text-xl font-semibold text-primary">
  //                     {formatBalance(
  //                       swap.from.amount.label,
  //                       defaultLocale,
  //                       2,
  //                       'standard',
  //                     )}{' '}
  //                     {swap.from.token}
  //                   </span>
  //                 </div>
  //               </>
  //             )}
  //           </div>
  //         )}
  //         {swap?.stakingTime && (
  //           <div className="flex items-center self-center justify-between w-full py-2 justify-self-end">
  //             <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
  //               <span className="text-xl font-semibold text-primary">
  //                 {t('stakeTime')}
  //               </span>
  //             </div>
  //             <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
  //               <span className="text-xl font-medium text-secondary">
  //                 {t('monthsAmount', { count: swap.stakingTime })}
  //               </span>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //       {hash && (
  //         <div className="flex items-center self-center justify-between w-full py-2">
  //           <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
  //             <Image
  //               src={'/images/icons/etherscan.svg'}
  //               alt={'etherscan'}
  //               width={24}
  //               height={24}
  //             />
  //             <span className="text-sm text-sub-dark font-medium">
  //               {t('tx')}:
  //             </span>
  //           </div>
  //           <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
  //             <a
  //               href={`https://goerli.etherscan.io/tx/${hash}`}
  //               target="_blank"
  //               rel="noreferrer"
  //               className="text-sm font-medium truncate max-w-xs hover:underline"
  //             >
  //               {hash}
  //             </a>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </>
  // );

  return (
    <>
      {action === 'stake' && (
        <div className="flex flex-col items-center justify-center w-full gap-y-4">
          <div className="w-full p-2 m-2 rounded-lg h-30 bg-gray-900 flex place-items-center">
            <p className="text-white">space for animation</p>
          </div>
          <div>
            <p className="text-lg text-sub-dark font-medium text-center">
              {actionMap}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-y-4 rounded-lg px-2 py-4 m-2 bg-[url('/images/background/bg-rewards.png')] bg-cover shadow-md relative">
            <div className="absolute inset-0 bg-white opacity-30 z-0" />
            <p className="bg-clip-text text-transparent bg-gradient-major-secondary-predominant font-bold text-xl z-10">
              {t('staked')}
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
                  2,
                  'standard',
                )}{' '}
                {swap.to.token}
              </span>
            </div>
          </div>
          {hash && (
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
      )}
    </>
  );
}
