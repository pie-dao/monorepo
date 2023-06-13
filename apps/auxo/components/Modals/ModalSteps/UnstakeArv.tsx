import { Dialog } from '@headlessui/react';
import { useConnectWallet } from '@web3-onboard/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useStakingTokenContract } from '../../../hooks/useContracts';
import { useTokenBalance, useUserLockAmount } from '../../../hooks/useToken';
import { thunkWithdrawFromVeAUXO } from '../../../store/products/thunks';
import { formatBalance } from '../../../utils/formatBalance';
import ArvImage from '../../../public/tokens/24x24/ARV.svg';
import { useState } from 'react';
import { ExclamationIcon } from '@heroicons/react/solid';
import { setSwap } from '../../../store/modal/modal.slice';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

type Props = {
  closeModal: () => void;
};

const UnstakeArv = ({ closeModal }: Props) => {
  const { t } = useTranslation();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const tokenLocker = useStakingTokenContract('ARV');
  const dispatch = useAppDispatch();
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const ARVBalance = useTokenBalance('ARV');
  const AuxoInARV = useUserLockAmount('ARV');
  const { tx } = useAppSelector((state) => state.modal);

  const withdraw = () => {
    setWithdrawLoading(true);
    dispatch(thunkWithdrawFromVeAUXO({ account, tokenLocker })).finally(() =>
      setWithdrawLoading(false),
    );
    setSwap({
      swap: {
        from: {
          token: 'ARV',
          amount: ARVBalance,
        },
        to: {
          token: 'AUXO',
          amount: AuxoInARV,
        },
      },
    });
  };

  return (
    <>
      <div className="flex-shrink-0 justify-center w-full flex">⚠️</div>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('loseRewards', { token: 'ARV' })}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="mt-2">
          <p className="text-lg text-sub-dark font-medium">
            {t('sureToUnstake')}
          </p>
        </div>
        <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
          <div className="w-fit flex flex-col py-4">
            <div className="text-2xl text-white font-medium flex items-center gap-x-2 bg-red px-4 py-2 rounded-lg">
              <Image src={ArvImage} alt="ARV" width={24} height={24} />
              {formatBalance(ARVBalance.label, defaultLocale)} ARV
            </div>
          </div>
        </div>
        {!withdrawLoading ? (
          <div className="flex w-full justify-between gap-x-2">
            <button
              onClick={closeModal}
              className="w-full px-8 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
            >
              {t('cancel')}
            </button>
            <button
              onClick={withdraw}
              className="w-full px-8 py-2 text-lg font-medium text-white bg-red rounded-full ring-inset ring-2 ring-red enabled:hover:bg-transparent enabled:hover:text-red disabled:opacity-70"
            >
              {t('unstake')}
            </button>
          </div>
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
    </>
  );
};

export default UnstakeArv;
