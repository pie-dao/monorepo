import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import Image from 'next/image';
import { useStakingTokenContract } from '../../../hooks/useContracts';
import { useUserLockDuration } from '../../../hooks/useToken';
import {
  thunkIncreaseStakeAuxo,
  thunkStakeAuxo,
} from '../../../store/products/thunks';
import ArrowRight from '../../../public/images/icons/arrow-right.svg';
import { formatBalance } from '../../../utils/formatBalance';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { useWeb3React } from '@web3-react/core';
import AUXOImage from '../../../public/tokens/AUXO.svg';
import veAUXOImage from '../../../public/tokens/veAUXO.svg';

const imageMap = {
  AUXO: AUXOImage,
  veAUXO: veAUXOImage,
};

export default function StakeConfirm() {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { hash } = tx;
  const dispatch = useAppDispatch();
  const [depositLoading, setDepositLoading] = useState(false);
  const stakingContract = useStakingTokenContract(swap.to.token);
  const hasLock = useUserLockDuration(swap.to.token);

  const makeDeposit = () => {
    setDepositLoading(true);
    dispatch(
      hasLock
        ? thunkIncreaseStakeAuxo({
            deposit: swap?.from?.amount,
            tokenLocker: stakingContract,
            account,
          })
        : thunkStakeAuxo({
            deposit: swap?.from?.amount,
            tokenLocker: stakingContract,
            stakingTime: swap.stakingTime,
            account,
          }),
    ).finally(() => setDepositLoading(false));
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('Stake')}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="mt-2">
          <p className="text-lg text-sub-dark">
            {t('stakeTokenModalDescription', {
              token: swap?.from.token,
              months: swap?.stakingTime,
            })}
          </p>
        </div>
        <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
          {swap && (
            <div className="grid grid-cols-3 justify-items-center w-full py-2">
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start">
                <Image
                  src={imageMap[swap.from.token]}
                  alt={swap.from.token}
                  width={24}
                  height={24}
                />
                <span className="text-xl font-medium text-primary">
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
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-end">
                <Image
                  src={imageMap[swap.to.token]}
                  alt={swap.to.token}
                  width={24}
                  height={24}
                />
                <span className="text-xl font-medium text-secondary">
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
          )}
          {swap?.stakingTime && (
            <div className="flex items-center self-center justify-between w-full py-2">
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                <span className="text-xl font-medium text-primary">
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
          {hash && (
            <div className="flex items-center self-center justify-between w-full py-2">
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                <Image
                  src={'/images/icons/etherscan.svg'}
                  alt={'etherscan'}
                  width={24}
                  height={24}
                />
                <span className="text-xl font-medium text-primary">
                  {t('blockExplorer')}
                </span>
              </div>
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                <a
                  href={`https://goerli.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-medium text-secondary truncate underline max-w-xs"
                >
                  {hash}
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          {!depositLoading ? (
            <button
              type="button"
              className="w-full px-8 py-1 text-lg font-medium text-white bg-secondary rounded-2xl ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
              onClick={makeDeposit}
            >
              {t('stakeToken', { token: swap?.from.token })}
            </button>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </>
  );
}
