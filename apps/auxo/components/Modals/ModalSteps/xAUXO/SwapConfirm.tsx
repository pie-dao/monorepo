import { useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../../hooks';
import Image from 'next/image';
import {
  useAUXOTokenContract,
  usePRVRouterContract,
  useXAUXOTokenContract,
} from '../../../../hooks/useContracts';
import { thunkConvertXAUXO } from '../../../../store/products/thunks';
import ArrowRight from '../../../../public/images/icons/arrow-right.svg';
import { formatBalance } from '../../../../utils/formatBalance';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import { useConnectWallet } from '@web3-onboard/react';
import { useChainExplorer } from '../../../../hooks/useToken';
import AuxoImage from '../../../../public/tokens/AUXO.svg';
import PrvImage from '../../../../public/tokens/24x24/PRV.svg';
import PendingTransaction from '../../../PendingTransaction/PendingTransaction';
import { ethers } from 'ethers';

const imageMap = {
  AUXO: AuxoImage,
  PRV: PrvImage,
};

export default function StakeConfirm() {
  const { t } = useTranslation();

  const { tx, swap, isConvertAndStake } = useAppSelector(
    (state) => state.modal,
  );
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const [depositLoading, setDepositLoading] = useState(false);
  const auxoContract = useAUXOTokenContract();
  const xAUXOContract = useXAUXOTokenContract();
  const chainExplorer = useChainExplorer();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;

  const PRVRouterContract = usePRVRouterContract();

  const makeDeposit = () => {
    setDepositLoading(true);
    dispatch(
      thunkConvertXAUXO({
        deposit: swap?.from?.amount,
        auxoContract,
        xAUXOContract,
        account,
        wallet,
        PRVRouterContract,
        isConvertAndStake,
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
            {t(isConvertAndStake ? 'stakeAndConvertToken' : 'convertToken', {
              token: swap?.to?.token,
            })}
          </Dialog.Title>
          <div className="flex flex-col items-center justify-center w-full gap-y-6">
            <div className="mt-2">
              <p className="text-lg text-sub-dark font-medium">
                {t(
                  isConvertAndStake
                    ? 'convertAndStakeConfirmModalDescription'
                    : 'convertConfirmModalDescription',
                  {
                    token: swap?.to?.token,
                  },
                )}
              </p>
            </div>
            <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
              {swap && (
                <div className="flex flex-col gap-y-2 items-center justify-center py-4">
                  <div className="flex place-content-center w-full gap-x-2">
                    <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start">
                      <Image
                        src={imageMap[swap.from.token]}
                        alt={swap.from.token}
                        width={24}
                        height={24}
                      />
                      <span className="text-xl font-semibold text-primary">
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
                </div>
              )}

              {swap?.stakingTime && (
                <div className="flex items-center self-center justify-between w-full py-2">
                  <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                    <span className="text-xl font-semibold text-primary">
                      {t('stakeTime')}
                    </span>
                  </div>

                  <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                    <span className="text-xl font-medium text-secondary">
                      {t('monthsAmount', { count: swap.stakingTime })}
                    </span>
                  </div>
                </div>
              )}
              {tx?.hash && (
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
              )}
            </div>
            <div>
              {!depositLoading ? (
                <button
                  type="button"
                  className="w-full px-16 py-2.5 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                  onClick={makeDeposit}
                >
                  {t('iAmIn')}
                </button>
              ) : !tx?.hash ? (
                <div className="w-full flex justify-center">
                  <p className="bg-clip-text bg-gradient-major-colors text-transparent ">
                    {t('confirmInWallet')}
                  </p>
                </div>
              ) : (
                <LoadingSpinner />
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
