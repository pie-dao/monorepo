import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../../hooks';
import { useChainExplorer } from '../../../hooks/useToken';
import PendingTransaction from '../../PendingTransaction/PendingTransaction';
import Image from 'next/image';

export const PendingTransactionContent = () => {
  const { t } = useTranslation();
  const chainExplorer = useChainExplorer();
  const { tx } = useAppSelector((state) => state.lending.lendingFlow);

  return (
    <>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('pendingTransaction')}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="flex items-center self-center justify-between w-full py-2">
          <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
            <Image
              src={'/images/icons/etherscan.svg'}
              alt={'etherscan'}
              width={24}
              height={24}
            />
            <span className="text-xl font-semibold text-primary">
              {t('blockExplorer')}
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
        <div className="flex flex-col items-center self-center gap-y-4 w-full py-2">
          <PendingTransaction />
        </div>
      </div>
    </>
  );
};
