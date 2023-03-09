import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import Image from 'next/image';
import {
  getSigner,
  useAUXOTokenContract,
  useStakingTokenContract,
} from '../../../hooks/useContracts';
import {
  useChainExplorer,
  useUserLevel,
  useUserLockDuration,
  useUserNewEndDateFromToday,
} from '../../../hooks/useToken';
import {
  thunkIncreaseStakeAuxo,
  thunkStakeAuxo,
} from '../../../store/products/thunks';
import ArrowRight from '../../../public/images/icons/arrow-right.svg';
import { formatBalance } from '../../../utils/formatBalance';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { useWeb3React } from '@web3-react/core';
import AUXOImage from '../../../public/tokens/AUXO.svg';
import veAUXOImage from '../../../public/tokens/24x24/ARV.svg';
import AUXOBig from '../../../public/images/AUXOBig.svg';
import PendingTransaction from '../../PendingTransaction/PendingTransaction';

const imageMap = {
  AUXO: AUXOImage,
  ARV: veAUXOImage,
};

export default function StakeConfirm() {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const [depositLoading, setDepositLoading] = useState(false);
  const stakingContract = useStakingTokenContract(swap.to.token);
  const hasLock = useUserLockDuration(swap.to.token);
  const AUXOToken = useAUXOTokenContract();
  const signer = getSigner(library, account);
  const userLevel = useUserLevel(!hasLock ? swap.stakingTime : hasLock);
  const userNewEndDate = useUserNewEndDateFromToday(swap.stakingTime);
  const chainExplorer = useChainExplorer();

  const fireEmoji = useMemo(() => {
    if (userLevel !== 30) return null;
    return (
      <span role="img" aria-label="fire">
        MAX 🔥
      </span>
    );
  }, [userLevel]);

  const makeDeposit = () => {
    setDepositLoading(true);
    dispatch(
      hasLock
        ? thunkIncreaseStakeAuxo({
            signer,
            deposit: swap?.from?.amount,
            tokenLocker: stakingContract,
            AUXOToken,
          })
        : thunkStakeAuxo({
            signer,
            AUXOToken,
            deposit: swap?.from?.amount,
            tokenLocker: stakingContract,
            stakingTime: swap.stakingTime,
            account,
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
            {t('Stake')}
          </Dialog.Title>
          <div className="flex flex-col items-center justify-center w-full gap-y-6">
            <div className="mt-2 text-center">
              <p className="text-lg text-sub-dark font-medium">
                {!hasLock
                  ? t('stakeTokenModalDescription', {
                      token: swap?.from.token,
                      months: swap?.stakingTime,
                    })
                  : t('stakeTokenIncreaseAmountModalDescription', {
                      token: swap?.from.token,
                    })}
              </p>
            </div>
            <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
              {swap && (
                <div className="flex place-content-center w-full py-6 gap-x-2">
                  <div className="text-xl text-primary font-medium flex items-center gap-x-2 justify-self-end">
                    <Image
                      src={imageMap[swap.from.token]}
                      alt={swap.from.token}
                      width={24}
                      height={24}
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

              <div className="flex items-center self-center justify-between w-full py-4">
                <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                  <span className="text-sm font-medium text-primary">
                    {t('rewardLevel')}:{' '}
                    <span className="font-bold">
                      {userLevel} {fireEmoji}
                    </span>
                  </span>
                </div>
                <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                  <span className="text-sm font-medium text-primary">
                    {t('unlock')}{' '}
                    <span className="font-bold">{userNewEndDate}</span>
                  </span>
                </div>
              </div>
            </div>
            <div>
              {!depositLoading ? (
                <button
                  type="button"
                  className="w-full px-16 py-2.5 text-lg font-medium uppercase text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                  onClick={makeDeposit}
                >
                  {t('confirmArvStaking')}
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
                  href={`${chainExplorer?.url}/tx/${tx?.hash}`}
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
