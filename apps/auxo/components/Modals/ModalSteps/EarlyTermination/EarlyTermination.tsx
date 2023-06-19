import { useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../../hooks';
import Image from 'next/image';
import { useStakingTokenContract } from '../../../../hooks/useContracts';
import {
  useChainExplorer,
  useEarlyTerminationFee,
} from '../../../../hooks/useToken';
import { thunkEarlyTermination } from '../../../../store/products/thunks';
import ArrowRight from '../../../../public/images/icons/arrow-right.svg';
import { formatBalance } from '../../../../utils/formatBalance';
import { useConnectWallet } from '@web3-onboard/react';
import AUXOImage from '../../../../public/tokens/AUXO.svg';
import ARVImage from '../../../../public/tokens/32x32/ARV.svg';
import xAUXOImage from '../../../../public/tokens/24x24/PRV.svg';
import PendingTransaction from '../../../PendingTransaction/PendingTransaction';
import { ExclamationIcon } from '@heroicons/react/solid';

const imageMap = {
  AUXO: AUXOImage,
  ARV: ARVImage,
  PRV: xAUXOImage,
};

export default function StakeConfirm() {
  const { t } = useTranslation();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const [depositLoading, setDepositLoading] = useState(false);
  const chainExplorer = useChainExplorer();
  const tokenLocker = useStakingTokenContract(swap.from.token);
  const earlyTerminationFee = useEarlyTerminationFee();
  const feeInNumber = useMemo(() => {
    return `${
      Number(
        formatBalance(earlyTerminationFee.label, defaultLocale, 4, 'standard'),
      ) * 100
    }%`;
  }, [earlyTerminationFee, defaultLocale]);

  const terminateEarly = () => {
    setDepositLoading(true);
    dispatch(
      thunkEarlyTermination({
        account,
        tokenLocker,
      }),
    ).finally(() => setDepositLoading(false));
  };

  return (
    <>
      {!tx?.hash ? (
        <>
          <Dialog.Title
            as="h3"
            className="font-bold text-center text-xl text-primary capitalize w-full"
          >
            {t('earlyTerminationModalTitle')}
          </Dialog.Title>
          <div className="flex flex-col items-center justify-center w-full gap-y-6">
            <div className="mt-2 text-center">
              <p className="text-lg text-sub-dark font-medium">
                {t('earlyTerminationModalDescription')}
              </p>
            </div>
            <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
              {swap && (
                <div className="flex place-content-center w-full py-6 gap-x-2">
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
                    <Image
                      src={ArrowRight}
                      alt={'transfer'}
                      width={24}
                      height={24}
                    />
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
              <div className="flex items-center self-center justify-center w-full py-4">
                <div className="text-sm flex-col text-primary font-medium flex items-center gap-y-2">
                  <p className="flex gap-x-2">
                    <ExclamationIcon
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                    <span>{t('irreversible')}</span>
                  </p>
                  <p className="flex flex-col">
                    {t('earlyTerminationFee')}: {feeInNumber}
                  </p>
                  <div className="text-xl text-white font-medium flex items-center gap-x-2 bg-red px-4 py-2 rounded-lg">
                    <Image
                      src={imageMap['AUXO']}
                      alt={swap.from.token}
                      width={24}
                      height={24}
                    />
                    <span>
                      {t('losing')}:{' '}
                      {formatBalance(
                        swap.losingAmount.label,
                        defaultLocale,
                        4,
                        'standard',
                      )}{' '}
                      AUXO
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {!depositLoading ? (
                <button
                  type="button"
                  className="w-full px-16 py-2.5 text-lg font-medium uppercase text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                  onClick={terminateEarly}
                >
                  {t('confirmEarlyTermination')}
                </button>
              ) : (
                <div className="w-full flex justify-center">
                  <p className="bg-clip-text bg-gradient-major-colors text-transparent ">
                    {t('confirmInWallet')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <Dialog.Title
            as="h3"
            className="font-bold text-center text-xl text-primary capitalize w-full"
          >
            {t('stakingFromTo', {
              from: swap?.from.token,
              to: swap?.to.token,
            })}
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
      )}
    </>
  );
}
