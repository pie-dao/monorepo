import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { thunkChangePreference } from '../../../store/lending/lending.thunks';
import { useLendingPoolContract } from '../../../hooks/useContracts';
import { PendingTransactionContent } from './PendingTransactionContent';
import { PREFERENCES } from '../../../utils/constants';
import { UseUserCanClaim, UseUserCanCompound } from '../../../hooks/useLending';

export default function RequestWithdraw() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [lendClaim, setLendClaim] = useState(false);
  const { selectedPool, tx } = useAppSelector(
    (state) => state.lending.lendingFlow,
  );
  const lendingPoolContract = useLendingPoolContract(selectedPool);

  const canClaim = UseUserCanClaim(selectedPool);
  const canCompound = UseUserCanCompound(selectedPool);

  const unLendRewards = () => {
    setLendClaim(true);
    dispatch(
      thunkChangePreference({
        lendingPool: lendingPoolContract,
        preference: PREFERENCES.WITHDRAW,
        canClaim,
        canCompound,
      }),
    ).finally(() => setLendClaim(false));
  };

  return (
    <>
      {!tx?.hash ? (
        <>
          <Dialog.Title
            as="h3"
            className="font-bold text-center text-xl text-primary capitalize w-full"
          >
            {t('requestWithdrawPrincipal')}
          </Dialog.Title>
          <div className="w-full flex flex-col gap-y-4 items-center mt-4">
            {!lendClaim ? (
              <button
                type="button"
                className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                onClick={unLendRewards}
              >
                {t('claimRewards')}
              </button>
            ) : (
              <div className="w-full flex justify-center">
                <p className="bg-clip-text bg-gradient-major-colors text-transparent ">
                  {t('confirmInWallet')}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <PendingTransactionContent />
      )}
    </>
  );
}
