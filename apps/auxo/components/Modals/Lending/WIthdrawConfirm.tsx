import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { thunkWithdraw } from '../../../store/lending/lending.thunks';
import { useLendingPoolContract } from '../../../hooks/useContracts';
import { PendingTransactionContent } from './PendingTransactionContent';

export default function WithdrawConfirm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [lendClaim, setLendClaim] = useState(false);
  const { selectedPool, tx } = useAppSelector(
    (state) => state.lending.lendingFlow,
  );
  const lendingPoolContract = useLendingPoolContract(selectedPool);

  const withdraw = () => {
    setLendClaim(true);
    dispatch(
      thunkWithdraw({
        lendingPool: lendingPoolContract,
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
            {t('withdrawPrincipalTitle')}
          </Dialog.Title>
          <Dialog.Description className="text-center text-base text-sub-dark w-full mt-2 font-medium">
            {t('withdrawPrincipalDescription')}
          </Dialog.Description>
          <div className="w-full flex flex-col gap-y-4 items-center mt-4">
            {!lendClaim ? (
              <button
                type="button"
                className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                onClick={withdraw}
              >
                {t('withdrawPrincipal')}
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
