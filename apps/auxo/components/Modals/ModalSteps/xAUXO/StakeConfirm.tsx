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
import xAUXOImage from '../../../../public/tokens/xAUXO.svg';
import { xAUXOContract } from '../../../../store/products/products.contracts';
import { compareBalances } from '../../../../utils/balances';
import { useUserCurrentEpochStakedXAUXO } from '../../../../hooks/useToken';

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
  const { hash } = tx;
  const dispatch = useAppDispatch();
  const [depositLoading, setDepositLoading] = useState(false);
  const rollStaker = useRollStakerXAUXOContract();
  const signer = getSigner(library, account);
  const shouldRevertDeposit = compareBalances(
    swap?.from?.amount,
    'gt',
    useUserCurrentEpochStakedXAUXO(),
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
            <div className="grid grid-cols-2 justify-items-center w-full py-2">
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start">
                <span className="text-xl font-medium text-primary">
                  {t('amount')}:
                </span>
              </div>
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-end">
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
                  className="text-sm font-medium text-primary truncate underline max-w-xs"
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
              {t('confirmModal', {
                token: swap?.from.token,
                action: t(action),
              })}
            </button>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </>
  );
};

export default StakeConfirm;
