import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../../hooks';
import Image from 'next/image';
import {
  getSigner,
  useRollStakerXAUXOContract,
} from '../../../../hooks/useContracts';
import {
  thunkStakeXAUXO,
  thunkUnstakeXAUXO,
} from '../../../../store/products/thunks';
import { formatBalance } from '../../../../utils/formatBalance';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import { useWeb3React } from '@web3-react/core';
import AUXOImage from '../../../../public/tokens/AUXO.svg';
import xAUXOImage from '../../../../public/tokens/24x24/PRV.svg';
import { xAUXOContract } from '../../../../store/products/products.contracts';
import { compareBalances } from '../../../../utils/balances';
import { useUserCurrentEpochStakedPRV } from '../../../../hooks/useToken';

const imageMap = {
  AUXO: AUXOImage,
  PRV: xAUXOImage,
};

const StakeConfirm: React.FC<{
  action?: 'stake' | 'unstake';
}> = ({ action = 'stake' }) => {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const [depositLoading, setDepositLoading] = useState(false);
  const rollStaker = useRollStakerXAUXOContract();
  const signer = getSigner(library, account);
  const shouldRevertDeposit = compareBalances(
    swap?.from?.amount,
    'gt',
    useUserCurrentEpochStakedPRV(),
  );

  const makeDeposit = () => {
    setDepositLoading(true);
    action === 'stake' &&
      dispatch(
        thunkStakeXAUXO({
          xAUXO: xAUXOContract,
          deposit: swap?.from?.amount,
          account,
          rollStaker,
          signer,
        }),
      ).finally(() => setDepositLoading(false));
    action === 'unstake' &&
      dispatch(
        thunkUnstakeXAUXO({
          amount: swap?.from?.amount,
          account,
          rollStaker,
          shouldRevertDeposit,
        }),
      ).finally(() => setDepositLoading(false));
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t(action)}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="mt-2">
          <p className="text-lg text-sub-dark font-medium">
            {t('stakeConfirmModalDescription', {
              action: t(action),
              token: swap?.from.token,
            })}
          </p>
        </div>
        <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
          {swap && (
            <div className="flex place-content-center w-full py-6 gap-x-2 items-center">
              <div>
                <p className="font-medium text-primary text-xl">
                  {t('staking')}:
                </p>
              </div>
              <div className="text-2xl text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg">
                <Image
                  src={imageMap[swap.from.token]}
                  alt={swap.from.token}
                  width={24}
                  height={24}
                />
                {formatBalance(
                  swap.from.amount.label,
                  defaultLocale,
                  4,
                  'standard',
                )}{' '}
                {swap.from.token}
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
                  href={`https://goerli.etherscan.io/tx/${tx?.hash}`}
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
        <div className="w-full flex justify-center">
          {!depositLoading ? (
            <button
              type="button"
              className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
              onClick={makeDeposit}
            >
              {t('confirmModal', {
                token: swap?.from.token,
                action: t(action),
              })}
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
  );
};

export default StakeConfirm;
