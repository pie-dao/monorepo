import { Dialog } from '@headlessui/react';
import { useConnectWallet } from '@web3-onboard/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useStakingTokenContract } from '../../../hooks/useContracts';
import { useTokenBalance } from '../../../hooks/useToken';
import { thunkWithdrawFromVeAUXO } from '../../../store/products/thunks';
import { formatBalance } from '../../../utils/formatBalance';
import ArvImage from '../../../public/tokens/24x24/ARV.svg';
import { setStep } from '../../../store/modal/modal.slice';
import { STEPS } from '../../../store/modal/modal.types';

const UnstakeConfirm = () => {
  const { t } = useTranslation();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const goToUnstake = () => dispatch(setStep(STEPS.WITHDRAW_ARV));

  const ARVBalance = useTokenBalance('ARV');

  return (
    <>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('unstakeToken', { token: 'ARV' })}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="mt-2">
          <p className="text-lg text-sub-dark font-medium">
            {t('unstakeTokenDescription', { token: 'ARV' })}
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
        <div className="w-full flex justify-center">
          <button
            onClick={goToUnstake}
            className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
          >
            {t('unstake')}
          </button>
        </div>
      </div>
    </>
  );
};

export default UnstakeConfirm;
