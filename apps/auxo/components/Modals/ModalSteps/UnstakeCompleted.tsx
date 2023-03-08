import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../../hooks';
import Image from 'next/image';
import { formatBalance } from '../../../utils/formatBalance';
import ArvImage from '../../../public/tokens/24x24/ARV.svg';
import { useChainExplorer } from '../../../hooks/useToken';
import { Discord } from '../../Socials/Socials';

export default function UnstakeCompleted() {
  const { t } = useTranslation();
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { hash } = tx;
  const chainExplorer = useChainExplorer();
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
      <div className="flex flex-col items-center justify-center w-full gap-y-2">
        <Dialog.Title
          as="h3"
          className="font-bold text-center text-xl text-primary capitalize w-full"
        >
          {t('youUnstaked')}
        </Dialog.Title>
        <div className="flex flex-col items-center justify-center w-full gap-y-4 rounded-lg py-1 m-2 bg-red shadow-md relative">
          <div className="text-2xl text-white font-medium flex items-center gap-x-2">
            <Image src={ArvImage} alt="ARV" width={24} height={24} />
            {formatBalance(swap?.from?.amount?.label, defaultLocale)} ARV
          </div>
        </div>
        <p className="text-center font-medium text-lg text-primary">
          {t('sorryToSeeYouGo')}
        </p>
        <Discord />
        {hash && (
          <div className="flex items-center self-center justify-between w-full pt-4 pb-2 mt-2 border-t border-custom-border">
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
    </>
  );
}
